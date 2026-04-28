/**
 * Gemini AI Service — 5-key fallback + cooldown + round-robin + cache + rule-based fallback
 */

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
].filter(Boolean)

// Model priority list — tries each in order until one works
const MODELS = [
  'gemini-flash-latest',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
]

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const TIMEOUT_MS = 12000
const COOLDOWN_MS = 10 * 60 * 1000 // 10 minutes

// Per-key cooldown tracker
const keyCooldowns = {}

// In-memory cache
const cache = {}
const CACHE_TTL_MS = 10 * 60 * 1000

// Round-robin index
let rrIndex = 0

// ── helpers ───────────────────────────────────────────────────────────────────

function isOnCooldown(i) {
  const until = keyCooldowns[i]
  if (!until) return false
  if (Date.now() < until) return true
  delete keyCooldowns[i]
  return false
}

function setCooldown(i) {
  keyCooldowns[i] = Date.now() + COOLDOWN_MS
  console.log(`[Gemini] Key #${i + 1} placed on 10-min cooldown`)
}

function extractJSON(text) {
  if (!text) return null
  // Strip markdown fences
  let cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()
  // Find outermost { }
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    // Try to fix common issues: trailing commas
    try {
      const fixed = cleaned.slice(start, end + 1).replace(/,\s*([}\]])/g, '$1')
      return JSON.parse(fixed)
    } catch {
      return null
    }
  }
}

async function callGemini(apiKey, model, prompt) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 600 },
      }),
    })

    clearTimeout(timer)

    if (res.status === 429 || res.status === 403) {
      const err = new Error(`quota_exceeded:${res.status}`)
      err.quota = true
      throw err
    }

    if (res.status === 503 || res.status === 500 || res.status === 404) {
      throw new Error(`unavailable:${res.status}`)
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Empty response')
    return text
  } finally {
    clearTimeout(timer)
  }
}

// ── rule-based fallback ───────────────────────────────────────────────────────

function ruleBasedRecommendation(origin, destination, weatherData) {
  const w = weatherData || {}
  const rain = w.rainfall ?? 0
  const wind = w.windSpeed ?? 0
  const visibility = w.visibility ?? 10
  const hasStorm = w.storm ?? false

  let riskLevel = 'low'
  let delayHours = 0
  const suggestions = []

  if (hasStorm) {
    riskLevel = 'high'; delayHours += 3
    suggestions.push('Storm detected — consider delaying dispatch by 3–4 hours')
  } else if (rain > 50 || visibility < 2) {
    riskLevel = 'high'; delayHours += 2
    suggestions.push('Heavy rain and low visibility — reduce speed, use hazard lights')
  } else if (rain > 20 || wind > 40) {
    riskLevel = 'medium'; delayHours += 1
    suggestions.push('Moderate rain — allow extra buffer time')
  } else {
    suggestions.push('Conditions are clear — proceed on standard route')
  }

  if (wind > 60) suggestions.push('High wind speed — avoid open highway sections')
  if (visibility < 1) suggestions.push('Near-zero visibility — halt until conditions improve')

  return {
    recommended_route: `${origin} → ${destination}`,
    reason: 'Rule-based recommendation (AI temporarily unavailable) — based on live weather conditions',
    estimated_delay_hours: delayHours,
    risk_level: riskLevel,
    suggestions,
    source: 'rule_based',
  }
}

// ── main export ───────────────────────────────────────────────────────────────

export async function getAIRouteRecommendation({
  origin, destination, waypoints = [],
  weatherData, shipmentPriority = 'standard', shipmentId,
}) {
  // Cache check
  const cacheKey = `${shipmentId || origin}-${destination}`
  const cached = cache[cacheKey]
  if (cached && Date.now() < cached.expiresAt) {
    console.log(`[Gemini] Cache hit for ${cacheKey}`)
    return { success: true, data: cached.result, source: 'cache' }
  }

  if (GEMINI_KEYS.length === 0) {
    console.warn('[Gemini] No API keys configured — using rule-based fallback')
    return { success: true, data: ruleBasedRecommendation(origin, destination, weatherData), source: 'rule_based' }
  }

  const w = weatherData || {}
  const prompt = `You are an expert logistics route optimizer. Analyze this shipment and respond ONLY with a single valid JSON object. No markdown, no explanation outside JSON.

Shipment:
- Origin: ${origin}
- Destination: ${destination}
- Waypoints: ${waypoints.length > 0 ? waypoints.join(', ') : 'none'}
- Priority: ${shipmentPriority}
- Rainfall: ${w.rainfall ?? 0} mm/hr
- Wind: ${w.windSpeed ?? 0} km/h
- Visibility: ${w.visibility ?? 10} km
- Storm: ${w.storm ? 'YES' : 'No'}
- Weather: ${w.condition ?? 'Unknown'}

Respond with ONLY this JSON (fill in real values):
{"recommended_route":"${origin} -> ${destination}","reason":"your reasoning","estimated_delay_hours":0,"risk_level":"low","suggestions":["tip1","tip2"]}`

  // Round-robin start
  const total = GEMINI_KEYS.length
  const startIdx = rrIndex % total
  rrIndex = (rrIndex + 1) % total

  for (let attempt = 0; attempt < total; attempt++) {
    const i = (startIdx + attempt) % total

    if (isOnCooldown(i)) {
      console.log(`[Gemini] Key #${i + 1} on cooldown — skipping`)
      continue
    }

    // Try each model for this key
    for (const model of MODELS) {
      console.log(`[Gemini] Trying key #${i + 1} with model ${model}`)
      try {
        const rawText = await callGemini(GEMINI_KEYS[i], model, prompt)
        const parsed = extractJSON(rawText)

        if (!parsed) {
          console.warn(`[Gemini] Key #${i + 1} / ${model} — malformed JSON, trying next model`)
          continue
        }

        console.log(`[Gemini] ✅ Success — key #${i + 1}, model: ${model}`)

        const result = {
          recommended_route: parsed.recommended_route ?? `${origin} → ${destination}`,
          reason: parsed.reason ?? 'AI analysis complete',
          estimated_delay_hours: Number(parsed.estimated_delay_hours ?? 0),
          risk_level: ['low', 'medium', 'high'].includes(parsed.risk_level) ? parsed.risk_level : 'low',
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
          source: `gemini_key_${i + 1}`,
        }

        cache[cacheKey] = { result, expiresAt: Date.now() + CACHE_TTL_MS }
        return { success: true, data: result }

      } catch (err) {
        if (err.quota) {
          console.warn(`[Gemini] Key #${i + 1} — quota/auth error, cooling down`)
          setCooldown(i)
          break // move to next key
        } else if (err.name === 'AbortError') {
          console.warn(`[Gemini] Key #${i + 1} / ${model} — timeout`)
        } else {
          console.warn(`[Gemini] Key #${i + 1} / ${model} — ${err.message}`)
        }
      }
    }
  }

  console.warn('[Gemini] All keys/models failed — using rule-based fallback')
  return { success: true, data: ruleBasedRecommendation(origin, destination, weatherData), source: 'rule_based' }
}
