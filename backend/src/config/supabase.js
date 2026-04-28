import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from './env.js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/**
 * isNetworkError — returns true for DNS / fetch-failed errors
 * so controllers can fall back to the mock store.
 */
export function isNetworkError(err) {
  const msg = err?.message || ''
  return (
    msg.includes('fetch failed') ||
    msg.includes('ENOTFOUND') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('network') ||
    msg.includes('getaddrinfo')
  )
}
