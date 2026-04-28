import dotenv from 'dotenv'

dotenv.config()

const { SUPABASE_URL, SUPABASE_KEY } = process.env

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

export const PORT = process.env.PORT || 3001
export { SUPABASE_URL, SUPABASE_KEY }
