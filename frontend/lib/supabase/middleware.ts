import { NextResponse, type NextRequest } from "next/server"

const SUPABASE_URL = "https://qerymtenumzekndpfmnt.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcnltdGVudW16ZWtuZHBmbW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjM0MzgsImV4cCI6MjA3OTc5OTQzOH0.xuML-GQOG61xPKHSeTJThThKG5UsFKWM9NQsFwumOmQ"

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow auth routes and root
  const publicRoutes = ["/auth/login", "/auth/sign-up", "/auth/sign-up-success", "/auth/error", "/"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if user has auth token
  const hasAuthToken =
    request.cookies.has("sb-access-token") || request.cookies.has("sb-qerymtenumzekndpfmnt-auth-token")

  if (!hasAuthToken) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
