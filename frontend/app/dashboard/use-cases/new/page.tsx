"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useActiveProfile } from "@/lib/hooks/use-active-profile"
import { createUseCase } from "@/lib/api-use-cases"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProposeUseCasePage() {
  const router = useRouter()
  const activeProfile = useActiveProfile()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1 - Basics
  const [name, setName] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [problemStatement, setProblemStatement] = useState("")
  const [primaryPersona, setPrimaryPersona] = useState("")
  const [domain, setDomain] = useState("")

  // Step 2 - Initial Coverage (Optional)
  const [relatedMcpServers, setRelatedMcpServers] = useState<string[]>([])
  const [relatedSkills, setRelatedSkills] = useState<string[]>([])

  // Step 3 - Submit
  const [justification, setJustification] = useState("")

  if (!activeProfile) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground text-xs">Loading...</div>
      </div>
    )
  }

  const isPlatformGovernance = activeProfile.roleIds.includes("platform_governance")

  const canCreate =
    isPlatformGovernance ||
    activeProfile.roleIds.includes("publisher") ||
    activeProfile.roleIds.includes("product_admin")

  if (!canCreate) {
    return (
      <div className="p-8">
        <Card className="p-12 text-center">
          <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-xs">You don't have permission to propose use cases.</p>
          <Link href="/dashboard/use-cases">
            <Button className="mt-4 h-8 text-xs">Back to Use Cases</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const newUseCase = await createUseCase({
        title: name,
        description: shortDescription,
        bu_id: activeProfile.buId || null,
        status: "pending_product_admin", // Status = "In Review" as per requirements
        owner_email: activeProfile.email,
        skill_count: relatedSkills.length,
        mcp_server_count: relatedMcpServers.length,
        tags: domain ? [domain, primaryPersona].filter(Boolean) : [primaryPersona].filter(Boolean),
      })

      toast({
        title: "Use Case Proposed",
        description: "Your use case has been submitted for review.",
      })

      // Redirect to use case detail page
      router.push(`/dashboard/use-cases/${newUseCase.id}`)
    } catch (error) {
      console.error("[v0] Error creating use case:", error)
      toast({
        title: "Error",
        description: "Failed to propose use case. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStep1Valid = name && shortDescription && problemStatement && primaryPersona && domain
  const canSubmit = isStep1Valid && justification

  return (
    <div className="p-8 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <Link href="/dashboard/use-cases">
          <Button variant="ghost" className="gap-2 -ml-2 h-8 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Use Cases
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Propose New Use Case</h1>
        <p className="text-muted-foreground text-xs">Submit a new business use case for review and approval</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 max-w-3xl">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${
                step === currentStep
                  ? "bg-primary text-primary-foreground"
                  : step < currentStep
                    ? "bg-green-600 text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step < currentStep ? <Check className="h-4 w-4" /> : step}
            </div>
            <div className="text-xs font-medium flex-1">
              {step === 1 && "Basics"}
              {step === 2 && "Coverage"}
              {step === 3 && "Submit"}
            </div>
            {step < 3 && <div className="h-px bg-border flex-1" />}
          </div>
        ))}
      </div>

      {/* Form */}
      <Card className="max-w-3xl">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-base">
            {currentStep === 1 && "Step 1: Basic Information"}
            {currentStep === 2 && "Step 2: Initial Coverage (Optional)"}
            {currentStep === 3 && "Step 3: Justification & Submit"}
          </CardTitle>
          <CardDescription className="text-xs">
            {currentStep === 1 && "Provide the core details about the use case"}
            {currentStep === 2 && "Associate MCP servers and skills if known"}
            {currentStep === 3 && "Explain why this use case should be approved"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          {/* Step 1 - Basics */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., WAN Degradation Root Cause Analysis"
                  className="h-8 text-xs"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold">
                  Short Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief overview of what this use case accomplishes..."
                  className="min-h-20 text-xs"
                />
              </div>

              {/* Problem Statement */}
              <div className="space-y-1.5">
                <Label htmlFor="problem" className="text-xs font-semibold">
                  Problem Statement <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="problem"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="What problem does this use case solve?"
                  className="min-h-24 text-xs"
                />
              </div>

              {/* Primary Persona */}
              <div className="space-y-1.5">
                <Label htmlFor="persona" className="text-xs font-semibold">
                  Primary Persona <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="persona"
                  value={primaryPersona}
                  onChange={(e) => setPrimaryPersona(e.target.value)}
                  placeholder="e.g., Network Engineer, Security Analyst"
                  className="h-8 text-xs"
                />
              </div>

              {/* Domain */}
              <div className="space-y-1.5">
                <Label htmlFor="domain" className="text-xs font-semibold">
                  Domain <span className="text-destructive">*</span>
                </Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger id="domain" className="h-8 text-xs">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NetOps">NetOps</SelectItem>
                    <SelectItem value="SecOps">SecOps</SelectItem>
                    <SelectItem value="CloudOps">CloudOps</SelectItem>
                    <SelectItem value="DC Admin">DC Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2 - Initial Coverage */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                This step is optional. You can associate MCP servers and skills now or add them later from the use case
                detail page.
              </div>

              {/* Related MCP Servers */}
              <div className="space-y-1.5">
                <Label htmlFor="mcpServers" className="text-xs font-semibold">
                  Related MCP Servers (Optional)
                </Label>
                <Input
                  id="mcpServers"
                  placeholder="Enter MCP server names (comma-separated)"
                  className="h-8 text-xs"
                  onChange={(e) =>
                    setRelatedMcpServers(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                />
                {relatedMcpServers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {relatedMcpServers.map((server, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[11px]">
                        {server}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Related Skills */}
              <div className="space-y-1.5">
                <Label htmlFor="skills" className="text-xs font-semibold">
                  Related Skills (Optional)
                </Label>
                <Input
                  id="skills"
                  placeholder="Enter skill names (comma-separated)"
                  className="h-8 text-xs"
                  onChange={(e) =>
                    setRelatedSkills(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                />
                {relatedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {relatedSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[11px]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 - Submit */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground">Review Your Submission</p>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-muted-foreground">Name:</span> <span className="font-medium">{name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Domain:</span>{" "}
                    <Badge variant="outline" className="text-[11px]">
                      {domain}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Persona:</span> {primaryPersona}
                  </div>
                  {relatedMcpServers.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">MCP Servers:</span> {relatedMcpServers.length}
                    </div>
                  )}
                  {relatedSkills.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Skills:</span> {relatedSkills.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Justification */}
              <div className="space-y-1.5">
                <Label htmlFor="justification" className="text-xs font-semibold">
                  Justification / Reason <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="justification"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Explain why this use case is important and should be approved..."
                  className="min-h-32 text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Provide a clear business justification for this use case to help reviewers understand its value.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack} className="gap-2 h-8 text-xs bg-transparent">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/use-cases">
                <Button variant="ghost" className="h-8 text-xs">
                  Cancel
                </Button>
              </Link>
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !isStep1Valid}
                  className="gap-2 h-8 text-xs"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} className="gap-2 h-8 text-xs">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Submit for Review
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
