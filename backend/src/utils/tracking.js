export function generateTrackingId() {
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  return `IND${timestamp}${random}`
}
