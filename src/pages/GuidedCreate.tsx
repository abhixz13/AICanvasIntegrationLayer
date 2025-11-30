import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Lightbulb,
  Code,
  CheckCircle,
  Download,
  ArrowRight,
  ArrowLeft,
  FileCode,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GuidedCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepCompleted, setStepCompleted] = useState<{ [key: number]: boolean }>({});
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, label: "Set up MCP codebase", done: false },
    { id: 2, label: "Implement skills", done: false },
    { id: 3, label: "Configure authentication", done: false },
    { id: 4, label: "Expose endpoint", done: false },
    { id: 5, label: "Generate MCP manifest JSON", done: false },
    { id: 6, label: "Run local tests using CLI", done: false },
  ]);

  const steps = [
    {
      title: "Overview",
      description: "Understand MCP fundamentals",
      icon: BookOpen,
    },
    {
      title: "Design & Capabilities",
      description: "Plan your MCP implementation",
      icon: Lightbulb,
    },
    {
      title: "Implementation Checklist",
      description: "Build your MCP server",
      icon: Code,
    },
    {
      title: "Ready to Register",
      description: "Complete prerequisites",
      icon: CheckCircle,
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const canProceed = () => {
    if (currentStep === 2) {
      return checklistItems.every((item) => item.done);
    }
    return stepCompleted[currentStep] || false;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/register/wizard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const toggleChecklistItem = (id: number) => {
    setChecklistItems((items) =>
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Create & Register MCP Server</h1>
          <p className="text-muted-foreground">
            Guided walkthrough to help you build and register your MCP server
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${
                  isActive ? "ring-2 ring-primary shadow-lg" : ""
                } ${isCompleted ? "bg-accent" : ""}`}
                onClick={() => index < currentStep && setCurrentStep(index)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 p-2 rounded ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                          ? "bg-success text-success-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Understanding MCP</h2>
                  <p className="text-muted-foreground mb-6">
                    Learn the fundamentals of Model Context Protocol servers
                  </p>
                </div>

                <div className="grid gap-4">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">What is an MCP Server?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        An MCP Server is a standardized interface that exposes domain-specific
                        capabilities (called "skills") to AI assistants and automation platforms.
                        It acts as a bridge between your systems and AI agents.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">What are Skills?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Skills are individual capabilities your MCP server provides, such as
                        querying data, executing commands, or retrieving information. Each skill
                        has inputs, outputs, and risk classifications (Read, Write, Automation).
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">How Canvas/C3 Uses MCPs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Canvas and C3 platforms discover and invoke MCP skills dynamically based
                        on user intent, enabling AI-powered workflows across your organization's
                        systems without custom integrations.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="understand"
                    checked={stepCompleted[0]}
                    onCheckedChange={(checked) =>
                      setStepCompleted({ ...stepCompleted, 0: checked as boolean })
                    }
                  />
                  <Label htmlFor="understand" className="text-sm cursor-pointer">
                    I understand these concepts and I'm ready to proceed
                  </Label>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Design Your MCP</h2>
                  <p className="text-muted-foreground mb-6">
                    Define the capabilities and requirements for your MCP server
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mcp-name">Proposed MCP Name</Label>
                    <Input id="mcp-name" placeholder="e.g., Network Operations MCP" />
                  </div>

                  <div>
                    <Label htmlFor="use-case">Use Case Intent</Label>
                    <Textarea
                      id="use-case"
                      placeholder="Describe what business problems this MCP will solve..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">Expected Skills (one per line)</Label>
                    <Textarea
                      id="skills"
                      placeholder="• Query device inventory&#10;• Execute network commands&#10;• Retrieve configuration data"
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="risks">Risk Types</Label>
                    <Textarea
                      id="risks"
                      placeholder="Describe potential risks and mitigation strategies..."
                      rows={3}
                    />
                  </div>

                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download MCP Design Template
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="designed"
                    checked={stepCompleted[1]}
                    onCheckedChange={(checked) =>
                      setStepCompleted({ ...stepCompleted, 1: checked as boolean })
                    }
                  />
                  <Label htmlFor="designed" className="text-sm cursor-pointer">
                    I have designed my MCP and documented the requirements
                  </Label>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Implementation Checklist</h2>
                  <p className="text-muted-foreground mb-6">
                    Complete these steps to build your MCP server in your environment
                  </p>
                </div>

                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`border-2 transition-all ${
                        item.done ? "border-success bg-success/5" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={`item-${item.id}`}
                              checked={item.done}
                              onCheckedChange={() => toggleChecklistItem(item.id)}
                            />
                            <Label
                              htmlFor={`item-${item.id}`}
                              className={`text-sm cursor-pointer ${
                                item.done ? "line-through text-muted-foreground" : ""
                              }`}
                            >
                              {item.label}
                            </Label>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Guide
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {checklistItems.every((item) => item.done) && (
                  <Card className="border-success bg-success/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">
                          All implementation steps completed! Ready to proceed.
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Ready to Register</h2>
                  <p className="text-muted-foreground mb-6">
                    Verify you have everything needed to register your MCP server
                  </p>
                </div>

                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle>Prerequisites Checklist</CardTitle>
                    <CardDescription>
                      Ensure you have the following before proceeding
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm">MCP server is built and running</span>
                    </div>
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm">Endpoint URL is accessible</span>
                    </div>
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm">Authentication is configured</span>
                    </div>
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm">MCP manifest JSON is ready</span>
                    </div>
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm">Local tests are passing</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <FileCode className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">What happens next?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          You'll enter the registration wizard where you'll provide your MCP
                          details, endpoint information, import skills, map to use cases, and run
                          validation tests before submitting for approval.
                        </p>
                        <Button className="w-full gap-2" size="lg">
                          Start Registration Wizard
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 0 ? "Back to Catalog" : "Previous"}
          </Button>

          <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
            {currentStep === steps.length - 1 ? "Start Registration Wizard" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
