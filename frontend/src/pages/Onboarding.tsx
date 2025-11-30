
import { useEffect, useState } from "react"
import { useRouter } from "react-router-dom"
import { createClient } from "@/lib/supabase/client"
import { getBusinessUnits, getRoles, createUserProfile } from "@/lib/api"
import type { BusinessUnit, Role } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CiscoLogo } from "@/components/cisco-logo"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, ArrowLeft, Building2, UserCog, CheckCircle2, Info } from "lucide-react"

type Step = "welcome" | "roles" | "bu" | "confirm"

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email: string; full_name: string } | null>(null)

  const [currentStep, setCurrentStep] = useState<Step>("welcome")
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([])
  const [roles, setRoles] = useState<Role[]>([])

  const [selectedBU, setSelectedBU] = useState<string>("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasPlatformGovernance = selectedRoles.some(
    (roleId) => roles.find((r) => r.id === roleId)?.name === "Platform Governance",
  )

  const getSteps = (): Step[] => {
    if (hasPlatformGovernance) {
      return ["welcome", "roles", "confirm"] // Skip BU selection for Platform Governance
    }
    return ["welcome", "roles", "bu", "confirm"]
  }

  const currentSteps = getSteps()
  const currentStepIndex = currentSteps.indexOf(currentStep)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        navigate("/auth/login")
        return
      }

      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id, onboarded")
        .eq("id", authUser.id)
        .maybeSingle()

      if (existingProfile?.onboarded) {
        navigate("/dashboard")
        return
      }

      setUser({
        id: authUser.id,
        email: authUser.email || "",
        full_name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
      })

      try {
        const [busData, rolesData] = await Promise.all([getBusinessUnits(), getRoles()])
        setBusinessUnits(busData)
        setRoles(rolesData)
      } catch (err) {
        console.error("Failed to load reference data:", err)
        setError("Failed to load data. Please refresh the page.")
      }

      setIsLoading(false)
    }

    init()
  }, [router])

  const canProceed = () => {
    switch (currentStep) {
      case "welcome":
        return true
      case "roles":
        return selectedRoles.length > 0
      case "bu":
        return selectedBU !== ""
      case "confirm":
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    const steps = getSteps()

    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    const steps = getSteps()

    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) => {
      const newRoles = prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]

      const willHavePlatformGovernance = newRoles.some(
        (id) => roles.find((r) => r.id === id)?.name === "Platform Governance",
      )

      if (!willHavePlatformGovernance && currentStep === "confirm" && selectedBU === "") {
        setCurrentStep("roles")
      }

      return newRoles
    })
  }

  const handleSubmit = async () => {
    if (!user) return

    setIsSubmitting(true)
    setError(null)

    try {
      await createUserProfile(
        hasPlatformGovernance ? null : selectedBU,
        null, // No product selection per user request
        selectedRoles,
        user.full_name,
        user.email,
      )
      navigate("/dashboard")
      router.refresh()
    } catch (err) {
      console.error("Failed to create profile:", err)
      setError(err instanceof Error ? err.message : "Failed to create profile. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    )
  }

  const selectedBUName = businessUnits.find((bu) => bu.id === selectedBU)?.name
  const selectedRoleNames = roles.filter((r) => selectedRoles.includes(r.id)).map((r) => r.name)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CiscoLogo className="h-8 w-auto text-foreground" />
            <span className="text-lg font-semibold text-foreground">MCP Integration Platform</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{user?.email}</span>
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="border-b border-border px-6 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {currentSteps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${
                    index < currentStepIndex
                      ? "bg-foreground text-background"
                      : index === currentStepIndex
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground"
                  }
                `}
                >
                  {index < currentStepIndex ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </div>
                {index < currentSteps.length - 1 && (
                  <div
                    className={`
                    w-16 sm:w-24 h-0.5 mx-2 transition-colors
                    ${index < currentStepIndex ? "bg-foreground" : "bg-secondary"}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {currentStep === "welcome" && <StepWelcome userName={user?.full_name || ""} />}
          {currentStep === "roles" && (
            <StepSelectRoles roles={roles} selectedRoles={selectedRoles} onToggleRole={handleRoleToggle} />
          )}
          {currentStep === "bu" && (
            <StepSelectBU businessUnits={businessUnits} selectedBU={selectedBU} onSelectBU={setSelectedBU} />
          )}
          {currentStep === "confirm" && (
            <StepConfirm
              buName={selectedBUName || ""}
              roleNames={selectedRoleNames}
              hasPlatformGovernance={hasPlatformGovernance}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep === "confirm" ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 bg-foreground text-background hover:bg-foreground/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2 bg-foreground text-background hover:bg-foreground/90"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function StepWelcome({ userName }: { userName: string }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center space-y-4">
        <CardTitle className="text-2xl font-bold text-card-foreground">Welcome, {userName.split(" ")[0]}</CardTitle>
        <CardDescription className="text-muted-foreground text-base leading-relaxed">
          This platform is used internally to create, register, test, and manage
          <span className="text-foreground font-medium"> MCP Servers</span> and
          <span className="text-foreground font-medium"> MCP Skills</span> across Cisco products in support of the AI
          Canvas ecosystem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Access is <span className="text-foreground font-medium">BU-controlled</span> and
              <span className="text-foreground font-medium"> role-based</span>. Before you can create or manage MCP
              Servers and Skills, we need to understand your Business Unit and Role.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StepSelectBU({
  businessUnits,
  selectedBU,
  onSelectBU,
}: {
  businessUnits: BusinessUnit[]
  selectedBU: string
  onSelectBU: (value: string) => void
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-card-foreground">Select Your Business Unit</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your BU determines which MCP assets you can manage
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedBU} onValueChange={onSelectBU}>
          <SelectTrigger className="w-full h-12 bg-input border-border text-foreground">
            <SelectValue placeholder="Choose your Business Unit" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {businessUnits.map((bu) => (
              <SelectItem key={bu.id} value={bu.id} className="cursor-pointer text-foreground">
                {bu.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

function StepSelectRoles({
  roles,
  selectedRoles,
  onToggleRole,
}: {
  roles: Role[]
  selectedRoles: string[]
  onToggleRole: (roleId: string) => void
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <UserCog className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-card-foreground">Select Your Role(s)</CardTitle>
            <CardDescription className="text-muted-foreground">
              Choose the role(s) that best describe your responsibilities
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`
              flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors
              ${
                selectedRoles.includes(role.id)
                  ? "border-foreground/50 bg-secondary"
                  : "border-border bg-card hover:bg-secondary/50"
              }
            `}
            onClick={() => onToggleRole(role.id)}
          >
            <Checkbox
              id={role.id}
              checked={selectedRoles.includes(role.id)}
              onCheckedChange={() => onToggleRole(role.id)}
              className="mt-0.5 border-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
            />
            <div className="flex-1">
              <Label htmlFor={role.id} className="text-foreground font-medium cursor-pointer">
                {role.name}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
            </div>
          </div>
        ))}

        {selectedRoles.some((roleId) => roles.find((r) => r.id === roleId)?.name === "Platform Governance") && (
          <div className="bg-secondary/50 rounded-lg p-4 border border-border mt-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">
                <span className="font-medium">Platform Governance</span> role has platform-wide access and is not tied
                to a specific Business Unit.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StepConfirm({
  buName,
  roleNames,
  hasPlatformGovernance,
}: {
  buName: string
  roleNames: string[]
  hasPlatformGovernance: boolean
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-card-foreground">Confirm Your Profile</CardTitle>
            <CardDescription className="text-muted-foreground">
              Review your selections before completing setup
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <ConfirmItem label="Role(s)" value={roleNames.join(", ")} />
          {!hasPlatformGovernance && <ConfirmItem label="Business Unit" value={buName} />}
        </div>

        <div className="bg-secondary/50 rounded-lg p-4 border border-border mt-6">
          <p className="text-sm text-muted-foreground">
            {hasPlatformGovernance
              ? "As Platform Governance, you have platform-wide access to manage settings and configurations across all Business Units."
              : "You can update these settings later from your profile. Your access to MCP Servers, Skills, and Use Cases will be scoped to your selected BU and roles."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function ConfirmItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  )
}
