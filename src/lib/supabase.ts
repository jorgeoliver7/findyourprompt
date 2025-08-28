import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single instance that will be reused
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export function createSupabaseBrowserClient() {
  return supabase
}