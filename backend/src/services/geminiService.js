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

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
const TIMEOUT_MS = 12000
const COOLDOWN_MS = 10 * 60 * 1000 // 10 minutes

// Per-key cooldown tracker: { keyIndex: timestamp }
const keyCooldowns = {}

// Simple in-memory cache: { cacheKey: { result, expiresAt } }
const cache = {}
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

// Round-robin start index
let rrIndex = 0

// ── helpers ──────────────────────────────────────────────────────────────────

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
  // Strip markdown fences
  let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  // Find first { ... }
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    return JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    return null
  }
}

async function callGemini(apiKey, prompt) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
      }),
    })

    clearTimeout(timer)

    if (res.status === 429 || res.status === 403) {
      const err = new Error(`quota_exceeded:${res.status}`)
      err.quota = true
      throw err
    }

    if (res.status === 503 || res.status === 500) {
      throw new Error(`server_overloaded:${res.status}`)
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Empty response from Gemini')
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
    riskLevel = 'high'
    delayHours += 3
    suggestions.push('Storm detected — consider delaying dispatch by 3–4 hours')
  } else if (rain > 50 || visibility < 2) {
    riskLevel = 'high'
    delayHours += 2
    suggestions.push('Heavy rain and low visibility — reduce speed, use hazard lights')
  } else if (rain > 20 || wind > 40) {
    riskLevel = 'medium'
    delayHours += 1
    suggestions.push('Moderate rain — allow extra buffer time')
  } else {
    suggestions.push('Conditions are clear — proceed on standard route')
  }

  if (wind > 60) suggestions.push('High wind speed — avoid open highway sections')
  if (visibility < 1) suggestions.push('Near-zero visibility — halt until conditions improve')

  return {
    recommended_route: `${origin} → ${destination}`,
    reason: 'Rule-based recommendation (AI unavailable) — based on current weather conditions',
    estimated_delay_hours: delayHours,
    risk_level: riskLevel,
    suggestions,
    source: 'rule_based',
  }
}

// ── main export ───────────────────────────────────────────────────────────────

export async function getAIRouteRecommendation({ origin, destination, waypoints = [], weatherData, shipmentPriority = 'standard', shipmentId }) {
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
  const prompt = `You are an expert logistics route optimizer.

Analyze this shipment route and recommend the safest and fastest option.

Shipment details:
- Origin: ${origin}
- Destination: ${destination}
- Waypoints: ${waypoints.length > 0 ? waypoints.join(', ') : 'none'}
- Priority: ${shipmentPriority}

Current weather conditions:
- Rainfall: ${w.rainfall ?? 0} mm/hr
- Wind speed: ${w.windSpeed ?? 0} km/h
- Visibility: ${w.visibility ?? 10} km
- Storm alert: ${w.storm ? 'YES' : 'No'}
- Condition: ${w.condition ?? 'Unknown'}
- Temperature: ${w.temperature ?? 'N/A'}°C

Analyze weather impact, route safety, and estimated delays.
Respond ONLY in valid JSON — no markdown, no extra text.

{
  "recommended_route": "City A -> City B -> City C",
  "reason": "explanation here",
  "estimated_delay_hours": 0,
  "risk_level": "low",
  "suggestions": ["tip 1", "tip 2"]
}`

  // Round-robin start
  const total = GEMINI_KEYS.length
  const startIdx = rrIndex % total
  rrIndex = (rrIndex + 1) % total

  for (let attempt = 0; attempt < total; attempt++) {
    const i = (startIdx + attempt) % total

    if (isOnCooldown(i)) {
      console.log(`[Gemini] Key #${i + 1} is on cooldown — skipping`)
      continue
    }

    console.log(`[Gemini] Trying key #${i + 1}`)

    try {
      const rawText = await callGemini(GEMINI_KEYS[i], prompt)
      const parsed = extractJSON(rawText)

      if (!parsed) {
        console.warn(`[Gemini] Key #${i + 1} returned malformed JSON — skipping`)
        continue
      }

      console.log(`[Gemini] Success with key #${i + 1}`)

      const result = {
        recommended_route: parsed.recommended_route ?? `${origin} → ${destination}`,
        reason: parsed.reason ?? 'AI analysis complete',
        estimated_delay_hours: Number(parsed.estimated_delay_hours ?? 0),
        risk_level: parsed.risk_level ?? 'low',
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        source: `gemini_key_${i + 1}`,
      }

      // Store in cache
      cache[cacheKey] = { result, expiresAt: Date.now() + CACHE_TTL_MS }

      return { success: true, data: result }
    } catch (err) {
      if (err.quota) {
        console.warn(`[Gemini] Key #${i + 1} failed — quota/auth error`)
        setCooldown(i)
      } else if (err.name === 'AbortError') {
        console.warn(`[Gemini] Key #${i + 1} timed out after ${TIMEOUT_MS / 1000}s`)
      } else {
        console.warn(`[Gemini] Key #${i + 1} failed — ${err.message}`)
      }
    }
  }

  // All keys failed — rule-based fallback
  console.warn('[Gemini] All keys failed — using rule-based fallback')
  const fallback = ruleBasedRecommendation(origin, destination, weatherData)
  return { success: true, data: fallback, source: 'rule_based' }
}
