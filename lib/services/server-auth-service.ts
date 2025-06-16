
import { createClient } from "@/lib/supabase/server"

export async function createServerSupabaseClient() {
  return createClient()
}
