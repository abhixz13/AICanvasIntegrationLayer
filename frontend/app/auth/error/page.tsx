import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CiscoLogo } from "@/components/cisco-logo"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <CiscoLogo className="h-8 w-auto text-foreground" />
          <span className="text-lg font-semibold text-foreground">MCP Integration Platform</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-border bg-card">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {params?.error || "An unexpected error occurred during authentication."}
              </p>
              <div className="text-center pt-4">
                <Link
                  href="/auth/login"
                  className="text-sm text-foreground underline underline-offset-4 hover:text-muted-foreground"
                >
                  Return to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
