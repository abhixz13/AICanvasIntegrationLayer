
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "react-router-dom"
import { Link } from "react-router-dom"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CiscoLogo } from "@/components/cisco-logo"
import { Loader2, KeyRound, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User clicked the reset link and is now in password recovery mode
      }
    })
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        throw error
      }

      setIsSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth/login")
      }, 3000)
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
                  <KeyRound className="h-7 w-7 text-foreground" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  {isSuccess ? "Password Updated" : "Set New Password"}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  {isSuccess
                    ? "Your password has been successfully reset. Redirecting to sign in..."
                    : "Enter your new password below."}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isSuccess ? (
                <div className="text-center">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full h-11 text-base font-medium bg-transparent">
                      Go to Sign In
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">
                      New Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-input border-border text-foreground"
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-input border-border text-foreground"
                      placeholder="Re-enter your password"
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
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
