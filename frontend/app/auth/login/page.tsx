"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CiscoLogo } from "@/components/cisco-logo"
import { Loader2, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("admin")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSsoLoading, setIsSsoLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        throw error
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id, onboarded")
        .eq("id", data.user?.id)
        .single()

      if (profile && profile.onboarded) {
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCiscoSso = async () => {
    setIsSsoLoading(true)
    setError(null)

    // Demo: Simulate SSO login delay then redirect
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/dashboard")
  }

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
            <CardHeader className="text-center space-y-4 pb-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-card-foreground">Welcome Back</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Sign in to access the MCP Integration Platform
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border border-border rounded-lg p-4 bg-secondary/30">
                <p className="text-sm text-muted-foreground text-center mb-3">Recommended for Cisco employees</p>
                <Button
                  type="button"
                  onClick={handleCiscoSso}
                  className="w-full h-11 text-base font-medium bg-[#049fd9] text-white hover:bg-[#0388ba]"
                  disabled={isSsoLoading}
                >
                  {isSsoLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting to SSO...
                    </>
                  ) : (
                    <>
                      <CiscoLogo className="mr-2 h-5 w-5" />
                      Login with Cisco SSO
                    </>
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground">
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border text-foreground"
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <Link
                  href="/auth/sign-up"
                  className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Internal use only. Cisco employees with valid credentials.
          </p>
        </div>
      </main>
    </div>
  )
}
