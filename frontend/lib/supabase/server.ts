import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const SUPABASE_URL = "https://qerymtenumzekndpfmnt.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcnltdGVudW16ZWtuZHBmbW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjM0MzgsImV4cCI6MjA3OTc5OTQzOH0.xuML-GQOG61xPKHSeTJThThKG5UsFKWM9NQsFwumOmQ"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          // Handle cookie setting errors in server components
        }
      },
    },
  })
}
