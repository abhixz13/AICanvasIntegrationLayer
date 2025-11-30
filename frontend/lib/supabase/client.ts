import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = "https://qerymtenumzekndpfmnt.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcnltdGVudW16ZWtuZHBmbW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjM0MzgsImV4cCI6MjA3OTc5OTQzOH0.xuML-GQOG61xPKHSeTJThThKG5UsFKWM9NQsFwumOmQ"

// Singleton pattern for client-side Supabase client
let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!client) {
    client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return client
}
