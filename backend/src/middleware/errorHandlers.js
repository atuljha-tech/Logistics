export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, error: 'Route not found' })
}

export function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err)
  res.status(500).json({ success: false, error: 'Internal server error' })
}
