export function healthCheck(req, res) {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
}
