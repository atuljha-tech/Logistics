export function deriveCity(senderOrReceiverCity, address) {
  if (senderOrReceiverCity) return senderOrReceiverCity
  if (!address || typeof address !== 'string') return 'Unknown'

  const parts = address
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)

  if (parts.length === 0) return 'Unknown'

  const candidate = parts[parts.length - 1]
  const localityHints = /(road|street|park|complex|extension|beach|center|centre|area|hub|city|nagar|place|warehouse)/i

  if (localityHints.test(candidate)) {
    const [firstToken] = candidate.split(/\s+/)
    return firstToken || 'Unknown'
  }

  return candidate
}
