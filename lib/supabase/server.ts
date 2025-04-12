import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a Supabase client with the service role key for server-side operations
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
}

// Create a Supabase client with the anon key for server-side operations
export const createServerSupabaseClientWithAnonKey = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}
