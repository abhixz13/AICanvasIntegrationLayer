"use client"

import { useState, useEffect } from "react"
import { X, Check, BookOpen, Download, ArrowRight, Shield, Zap, Server, FileText, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CreateMcpWizardProps {
    isOpen: boolean
    onClose: () => void
    initialFlow?: "build" | "register"
}

type WizardStep = "overview" | "design" | "checklist" | "ready"

export function CreateMcpWizard({ isOpen, onClose, initialFlow = "build" }: CreateMcpWizardProps) {
    const [currentStep, setCurrentStep] = useState<WizardStep>("overview")
    const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([])

    // Step 1: Overview State
    const [overviewAcknowledged, setOverviewAcknowledged] = useState(false)

    // Step 2: Design State
    const [designData, setDesignData] = useState({
        name: "",
        useCases: "",
        skills: "",
        risks: [] as string[],
    })
    const [designAcknowledged, setDesignAcknowledged] = useState(false)

    // Step 3: Checklist State
    const [checklistItems, setChecklistItems] = useState({
        codebase: false,
        tools: false,
        endpoint: false,
        auth: false,
        manifest: false,
        tests: false,
    })

    // Load checklist from local storage
    useEffect(() => {
        const saved = localStorage.getItem("mcp_wizard_checklist")
        if (saved) {
            setChecklistItems(JSON.parse(saved))
        }
    }, [])

    // Save checklist to local storage
    useEffect(() => {
        localStorage.setItem("mcp_wizard_checklist", JSON.stringify(checklistItems))
    }, [checklistItems])

    const steps: { id: WizardStep; label: string }[] = [
        { id: "overview", label: "Overview" },
        { id: "design", label: "Design & Capabilities" },
        { id: "checklist", label: "Implementation Checklist" },
        { id: "ready", label: "Ready to Register" },
    ]

    const handleNext = () => {
        const currentIndex = steps.findIndex((s) => s.id === currentStep)
        if (currentIndex < steps.length - 1) {
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep])
            }
            setCurrentStep(steps[currentIndex + 1].id as WizardStep)
        }
    }

    const handleStepClick = (stepId: WizardStep) => {
        // Allow navigation to completed steps or the next available step
        const stepIndex = steps.findIndex((s) => s.id === stepId)
        const currentIndex = steps.findIndex((s) => s.id === currentStep)

        // Can always go back
        if (stepIndex < currentIndex) {
            setCurrentStep(stepId)
            return
        }

        // Can go forward if previous steps are completed
        const previousStep = steps[stepIndex - 1]
        if (previousStep && completedSteps.includes(previousStep.id as WizardStep)) {
            setCurrentStep(stepId)
        }
    }

    const isStepComplete = (stepId: WizardStep) => completedSteps.includes(stepId)

    // Render Functions
    const renderStepIndicator = () => (
        <div className="w-64 bg-secondary/50 border-r border-border p-6 flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-semibold mb-1">Create MCP</h2>
                <p className="text-sm text-muted-foreground">Guided Build Path</p>
            </div>
            <div className="space-y-1">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer",
                            currentStep === step.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                            !completedSteps.includes(steps[Math.max(0, index - 1)].id as WizardStep) && index > 0 && currentStep !== step.id && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => handleStepClick(step.id)}
                    >
                        <div
                            className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                                currentStep === step.id
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : isStepComplete(step.id)
                                        ? "border-green-500 bg-green-500 text-white"
                                        : "border-muted-foreground"
                            )}
                        >
                            {isStepComplete(step.id) ? <Check className="w-3 h-3" /> : index + 1}
                        </div>
                        <span className="text-sm font-medium">{step.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderProgressPanel = () => (
        <div className="w-72 bg-secondary/50 border-l border-border p-6 hidden xl:block">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Check className="w-4 h-4" /> Progress
            </h3>
            <div className="space-y-4">
                {steps.map((step) => (
                    <div key={step.id} className="flex items-start gap-3">
                        <div className={cn("mt-1 w-2 h-2 rounded-full", isStepComplete(step.id) ? "bg-green-500" : "bg-muted-foreground/30")} />
                        <div>
                            <p className={cn("text-sm font-medium", isStepComplete(step.id) ? "text-foreground" : "text-muted-foreground")}>
                                {step.label}
                            </p>
                            {currentStep === step.id && <p className="text-xs text-muted-foreground mt-1">In Progress</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderOverview = () => (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold mb-2 text-white">Overview</h1>
                <p className="text-zinc-300 text-lg">Understand what an MCP server is and how it integrates with AI Canvas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 space-y-2 bg-zinc-800 border-zinc-700">
                    <Server className="w-8 h-8 text-blue-400" />
                    <h3 className="font-semibold text-white">What is an MCP server?</h3>
                    <p className="text-sm text-zinc-300">A standardized server that exposes data and tools to AI models via the Model Context Protocol.</p>
                </Card>
                <Card className="p-4 space-y-2 bg-zinc-800 border-zinc-700">
                    <Zap className="w-8 h-8 text-yellow-400" />
                    <h3 className="font-semibold text-white">What is a Skill?</h3>
                    <p className="text-sm text-zinc-300">A specific function or tool exposed by your MCP server that the AI can invoke (e.g., "get_user_data").</p>
                </Card>
                <Card className="p-4 space-y-2 bg-zinc-800 border-zinc-700">
                    <BookOpen className="w-8 h-8 text-green-400" />
                    <h3 className="font-semibold text-white">Integration</h3>
                    <p className="text-sm text-zinc-300">AI Canvas discovers your MCP server and dynamically uses its skills to answer user queries.</p>
                </Card>
            </div>

            <div className="flex gap-4">
                <Button variant="outline" className="gap-2 border-zinc-700 text-white hover:bg-zinc-800" asChild>
                    <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4" /> MCP Spec Docs
                    </a>
                </Button>
                <Button variant="outline" className="gap-2 border-zinc-700 text-white hover:bg-zinc-800" asChild>
                    <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" /> Sample Repo
                    </a>
                </Button>
            </div>

            <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                    id="overview-check"
                    checked={overviewAcknowledged}
                    onCheckedChange={(c) => setOverviewAcknowledged(!!c)}
                    className="border-zinc-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="overview-check" className="text-sm font-medium text-white cursor-pointer">
                    I understand the core concepts of MCP
                </Label>
            </div>
        </div>
    )

    const renderDesign = () => (
        <div className="flex gap-6 h-full">
            <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Design & Capabilities</h1>
                    <p className="text-muted-foreground">Plan your MCP server's identity and capabilities.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Intended MCP Name</Label>
                        <Input
                            placeholder="e.g., Jira Integration MCP"
                            value={designData.name}
                            onChange={(e) => setDesignData({ ...designData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>High-level Problem / Use Cases</Label>
                        <Textarea
                            placeholder="What problem does this MCP solve?"
                            value={designData.useCases}
                            onChange={(e) => setDesignData({ ...designData, useCases: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Expected Skills</Label>
                        <Textarea
                            placeholder="- get_ticket_details&#10;- update_ticket_status&#10;- search_tickets"
                            className="font-mono text-sm"
                            rows={5}
                            value={designData.skills}
                            onChange={(e) => setDesignData({ ...designData, skills: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Expected Risk Types</Label>
                        <div className="flex gap-4">
                            {["Read", "Write", "Automation"].map((risk) => (
                                <div key={risk} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`risk-${risk}`}
                                        checked={designData.risks.includes(risk)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setDesignData({ ...designData, risks: [...designData.risks, risk] })
                                            } else {
                                                setDesignData({ ...designData, risks: designData.risks.filter((r) => r !== risk) })
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`risk-${risk}`}>{risk}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" /> Download Design Template
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="design-check"
                            checked={designAcknowledged}
                            onCheckedChange={(c) => setDesignAcknowledged(!!c)}
                        />
                        <Label htmlFor="design-check">I have designed my MCP's capabilities</Label>
                    </div>
                </div>
            </div>

            <Card className="w-72 p-4 h-fit space-y-4 bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" /> Suggested Patterns
                </h3>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="font-medium">Data Retrieval</p>
                        <code className="text-xs bg-muted p-1 rounded">get_device_health</code>
                    </div>
                    <div>
                        <p className="font-medium">Action Execution</p>
                        <code className="text-xs bg-muted p-1 rounded">trigger_remediation</code>
                    </div>
                    <div>
                        <p className="font-medium">Search</p>
                        <code className="text-xs bg-muted p-1 rounded">search_logs</code>
                    </div>
                </div>
            </Card>
        </div>
    )

    const renderChecklist = () => (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold mb-2">Implementation Checklist</h1>
                <p className="text-muted-foreground">Follow these steps to build and verify your MCP server locally.</p>
            </div>

            <div className="space-y-4">
                {[
                    { id: "codebase", label: "Set up MCP server codebase (clone sample repo)" },
                    { id: "tools", label: "Implement required tools/skills based on your design" },
                    { id: "endpoint", label: "Expose MCP server endpoint and ensure it is reachable" },
                    { id: "auth", label: "Configure authentication (API key / OAuth / SSO)" },
                    { id: "manifest", label: "Generate and validate MCP manifest (JSON)" },
                    { id: "tests", label: "Run basic local tests using the official MCP client / CLI" },
                ].map((item) => (
                    <Card key={item.id} className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Label htmlFor={`check-${item.id}`} className="text-base font-medium cursor-pointer">
                                    {item.label}
                                </Label>
                            </div>
                            <a href="#" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                View Guide <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Done</span>
                            <Checkbox
                                id={`check-${item.id}`}
                                checked={checklistItems[item.id as keyof typeof checklistItems]}
                                onCheckedChange={(c) => setChecklistItems({ ...checklistItems, [item.id]: !!c })}
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )

    const renderReady = () => (
        <div className="space-y-8 max-w-2xl mx-auto text-center pt-8">
            <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold">Ready to Register</h1>
                <p className="text-muted-foreground text-lg">
                    Great job! You've designed and implemented your MCP server. You're now ready to register it with the platform.
                </p>
            </div>

            <Card className="p-6 text-left space-y-4 bg-muted/30">
                <h3 className="font-semibold">Prerequisites Checklist</h3>
                <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" /> Server endpoint is running and reachable
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" /> Authentication mechanism is configured
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" /> MCP manifest (JSON) is available
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" /> At least one business use case is identified
                    </li>
                </ul>
            </Card>

            <div className="flex flex-col gap-3">
                <Button size="lg" className="w-full gap-2" onClick={() => {
                    // In a real app, this would navigate to Flow B with pre-filled data
                    onClose()
                    // Trigger Flow B navigation here
                    window.location.href = "/dashboard/mcp-servers/create"
                }}>
                    Start Registration Wizard <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full gap-2">
                    <Download className="w-4 h-4" /> Download Registration Checklist
                </Button>
            </div>
        </div>
    )

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 overflow-hidden sm:rounded-xl border-2 border-white/20 shadow-2xl"
                style={{ display: 'flex', backgroundColor: '#18181b' }}
            >
                {/* Accessibility - Hidden but required */}
                <DialogTitle className="sr-only">Create MCP Server Wizard</DialogTitle>
                <DialogDescription className="sr-only">
                    A guided 4-step wizard to help you build and register your MCP server
                </DialogDescription>

                {/* Left: Stepper */}
                <div className="w-64 bg-zinc-900 border-r border-zinc-700 p-6 flex flex-col gap-6 shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold mb-1 text-white">Create MCP</h2>
                        <p className="text-sm text-zinc-400">Guided Build Path</p>
                    </div>
                    <div className="space-y-1">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer",
                                    currentStep === step.id
                                        ? "bg-blue-600 text-white"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-800",
                                    !completedSteps.includes(steps[Math.max(0, index - 1)].id as WizardStep) && index > 0 && currentStep !== step.id && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => handleStepClick(step.id)}
                            >
                                <div
                                    className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                                        currentStep === step.id
                                            ? "border-blue-400 bg-blue-600 text-white"
                                            : isStepComplete(step.id)
                                                ? "border-green-500 bg-green-500 text-white"
                                                : "border-zinc-600"
                                    )}
                                >
                                    {isStepComplete(step.id) ? <Check className="w-3 h-3" /> : index + 1}
                                </div>
                                <span className="text-sm font-medium">{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950" style={{ minWidth: 0 }}>
                    <div className="flex-1 overflow-y-auto p-8" style={{ color: 'white', pointerEvents: 'auto' }}>
                        {currentStep === "overview" && renderOverview()}
                        {currentStep === "design" && renderDesign()}
                        {currentStep === "checklist" && renderChecklist()}
                        {currentStep === "ready" && renderReady()}
                    </div>

                    {/* Footer Navigation */}
                    <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900 shrink-0">
                        <Button variant="ghost" onClick={onClose} className="text-white hover:bg-zinc-800">Cancel</Button>
                        <div className="flex gap-2">
                            {currentStep !== "overview" && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const currentIndex = steps.findIndex((s) => s.id === currentStep)
                                        if (currentIndex > 0) setCurrentStep(steps[currentIndex - 1].id as WizardStep)
                                    }}
                                    className="border-zinc-700 text-white hover:bg-zinc-800"
                                >
                                    Back
                                </Button>
                            )}
                            {currentStep !== "ready" && (
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        (currentStep === "overview" && !overviewAcknowledged) ||
                                        (currentStep === "design" && !designAcknowledged) ||
                                        (currentStep === "checklist" && !Object.values(checklistItems).every(Boolean))
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Progress Panel */}
                <div className="w-72 bg-zinc-900 border-l border-zinc-700 p-6 hidden xl:flex xl:flex-col gap-4 shrink-0">
                    <h3 className="font-semibold flex items-center gap-2 text-white">
                        <Check className="w-4 h-4" /> Progress
                    </h3>
                    <div className="space-y-4">
                        {steps.map((step) => (
                            <div key={step.id} className="flex items-start gap-3">
                                <div className={cn("mt-1 w-2 h-2 rounded-full", isStepComplete(step.id) ? "bg-green-500" : "bg-zinc-700")} />
                                <div>
                                    <p className={cn("text-sm font-medium", isStepComplete(step.id) ? "text-white" : "text-zinc-400")}>
                                        {step.label}
                                    </p>
                                    {currentStep === step.id && <p className="text-xs text-zinc-500 mt-1">In Progress</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
