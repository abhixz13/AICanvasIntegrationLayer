
import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CiscoLogo } from "@/components/cisco-logo"
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const redirectUrl = `${window.location.origin}/auth/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        throw error
      }

      setIsSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <CiscoLogo className="h-8 w-auto text-foreground" />
          <span className="text-lg font-semibold text-foreground">MCP Integration Platform</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-border bg-card">
            <CardHeader className="text-center space-y-4 pb-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                {isSuccess ? (
                  <CheckCircle className="h-7 w-7 text-green-500" />
                ) : (
                  <Mail className="h-7 w-7 text-foreground" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  {isSuccess ? "Check Your Email" : "Reset Password"}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  {isSuccess
                    ? "We've sent a password reset link to your email address."
                    : "Enter your email and we'll send you a link to reset your password."}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isSuccess ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                    >
                      try again
                    </button>
                  </p>
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full h-11 text-base font-medium bg-transparent">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@cisco.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}
                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-medium bg-foreground text-background hover:bg-foreground/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>

                  <div className="text-center text-sm">
                    <Link
                      href="/auth/login"
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
