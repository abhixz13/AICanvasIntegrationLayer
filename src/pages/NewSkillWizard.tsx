import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { WizardStepSkillBasics } from "@/components/wizard/WizardStepSkillBasics";
import { WizardStepSkillSchemas } from "@/components/wizard/WizardStepSkillSchemas";
import { WizardStepSkillRisk } from "@/components/wizard/WizardStepSkillRisk";
import { WizardStepSkillTest } from "@/components/wizard/WizardStepSkillTest";
import { WizardStepSkillReview } from "@/components/wizard/WizardStepSkillReview";

const steps = [
  { id: 1, name: "Skill Basics" },
  { id: 2, name: "Schemas" },
  { id: 3, name: "Risk & Guardrails" },
  { id: 4, name: "Test Skill" },
  { id: 5, name: "Review & Submit" },
];

export default function NewSkillWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mcpServerId = searchParams.get("mcp");
  const mcpServerName = searchParams.get("name") || "Unknown MCP";

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    mcp_server_id: mcpServerId,
    lifecycle_state: "draft",
  });

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.description && formData.risk_type;
      case 2:
        return formData.input_schema && formData.output_schema;
      case 3:
        return (
          formData.data_sensitivity &&
          formData.allowed_contexts &&
          formData.allowed_contexts.length > 0
        );
      case 4:
        return true; // Test is optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast.success("Skill saved as draft");
    navigate(`/mcp/${mcpServerId}`);
  };

  const handleSubmit = () => {
    setFormData({ ...formData, lifecycle_state: "in_review" });
    toast.success("Skill submitted for approval");
    navigate(`/skills/${Date.now()}`); // Mock skill ID
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WizardStepSkillBasics
            formData={formData}
            setFormData={setFormData}
            mcpServerName={mcpServerName}
          />
        );
      case 2:
        return <WizardStepSkillSchemas formData={formData} setFormData={setFormData} />;
      case 3:
        return <WizardStepSkillRisk formData={formData} setFormData={setFormData} />;
      case 4:
        return <WizardStepSkillTest formData={formData} setFormData={setFormData} />;
      case 5:
        return <WizardStepSkillReview formData={formData} mcpServerName={mcpServerName} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Vertical Stepper */}
      <div className="w-64 bg-card border-r p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/mcp/${mcpServerId}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MCP
        </Button>

        <div className="space-y-1">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              disabled={index > 0 && !isStepComplete(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentStep === step.id
                  ? "bg-primary text-primary-foreground"
                  : currentStep > step.id
                    ? "bg-muted text-foreground hover:bg-muted/80"
                    : "text-muted-foreground cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step.id
                      ? "bg-primary-foreground text-primary"
                      : currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {steps[currentStep - 1].name}
            </h1>
            <p className="text-muted-foreground">
              Step {currentStep} of {steps.length}
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">{renderStep()}</CardContent>
          </Card>

          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>

              {currentStep < steps.length ? (
                <Button onClick={handleNext} disabled={!isStepComplete(currentStep)}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Approval
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
