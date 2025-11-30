import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WizardStepBasics } from "@/components/wizard/WizardStepBasics";
import { WizardStepEndpoint } from "@/components/wizard/WizardStepEndpoint";
import { WizardStepSkills } from "@/components/wizard/WizardStepSkills";
import { WizardStepUseCases } from "@/components/wizard/WizardStepUseCases";
import { WizardStepTest } from "@/components/wizard/WizardStepTest";
import { WizardStepReview } from "@/components/wizard/WizardStepReview";

export default function RegisterWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});

  const steps = [
    { id: 1, title: "MCP Basics", component: WizardStepBasics },
    { id: 2, title: "Endpoint & Authentication", component: WizardStepEndpoint },
    { id: 3, title: "Import Skills", component: WizardStepSkills },
    { id: 4, title: "Use Case Mapping", component: WizardStepUseCases },
    { id: 5, title: "Test & Validate", component: WizardStepTest },
    { id: 6, title: "Review & Submit", component: WizardStepReview },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft
    console.log("Saving draft...", formData);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Left Sidebar - Stepper */}
      <div className="w-64 bg-card border-r border-border p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Register MCP Server</h2>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <nav className="space-y-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => index < currentStep && setCurrentStep(index)}
              disabled={index > currentStep}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                index === currentStep
                  ? "bg-primary text-primary-foreground font-medium"
                  : index < currentStep
                  ? "text-foreground hover:bg-accent cursor-pointer"
                  : "text-muted-foreground cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs">
                  {index < currentStep ? "✓" : step.id}
                </span>
                <span>{step.title}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-2">{steps[currentStep].title}</h1>
              <div className="h-1 bg-muted rounded-full">
                <div
                  className="h-1 bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <CurrentStepComponent formData={formData} setFormData={setFormData} />
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="max-w-4xl mx-auto mt-6 flex justify-between">
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 0 ? "Back to Catalog" : "Previous"}
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSaveDraft} className="gap-2">
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>

            <Button onClick={handleNext} className="gap-2">
              {currentStep === steps.length - 1 ? "Submit for Approval" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
