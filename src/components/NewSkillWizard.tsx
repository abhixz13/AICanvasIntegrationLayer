import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { mockMCPs } from "@/data/mockMCPs";

interface NewSkillWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ALLOWED_CONTEXTS = ["internal", "automation", "ai_workflows"];

export function NewSkillWizard({ open, onOpenChange }: NewSkillWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    risk_type: "",
    mcp_server_id: "",
    input_schema: "",
    output_schema: "",
    data_sensitivity: "",
    requires_approval: false,
    allowed_contexts: [] as string[],
  });

  const isStep1Valid = formData.name && formData.description && formData.risk_type && formData.mcp_server_id;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSaveDraft = () => {
    toast.success("Skill saved as draft");
    onOpenChange(false);
    resetForm();
  };

  const handleSubmit = () => {
    toast.success("Skill submitted for approval. Awaiting review from Product PM, Engineering Lead, and Platform PM.");
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: "",
      description: "",
      risk_type: "",
      mcp_server_id: "",
      input_schema: "",
      output_schema: "",
      data_sensitivity: "",
      requires_approval: false,
      allowed_contexts: [],
    });
  };

  const insertTemplateJSON = (type: "input" | "output") => {
    const template = {
      type: "object",
      properties: {
        [type === "input" ? "filter" : "result"]: { type: "string" },
      },
      required: [type === "input" ? "filter" : "result"],
    };
    if (type === "input") {
      setFormData({ ...formData, input_schema: JSON.stringify(template, null, 2) });
    } else {
      setFormData({ ...formData, output_schema: JSON.stringify(template, null, 2) });
    }
  };

  const toggleContext = (context: string) => {
    setFormData({
      ...formData,
      allowed_contexts: formData.allowed_contexts.includes(context)
        ? formData.allowed_contexts.filter((c) => c !== context)
        : [...formData.allowed_contexts, context],
    });
  };

  const selectedMCP = mockMCPs.find((mcp) => mcp.id === formData.mcp_server_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Skill</DialogTitle>
          <DialogDescription>Step {step} of 5</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="skill-name">
                  Skill Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="skill-name"
                  placeholder="e.g., list_devices, restart_service"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="skill-description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="skill-description"
                  placeholder="Describe what this skill does"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="mcp-server">
                  Attach to MCP Server <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.mcp_server_id}
                  onValueChange={(value) => setFormData({ ...formData, mcp_server_id: value })}
                >
                  <SelectTrigger id="mcp-server">
                    <SelectValue placeholder="Select an MCP server" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMCPs.map((mcp) => (
                      <SelectItem key={mcp.id} value={mcp.id}>
                        {mcp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>
                  Risk Type <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2 mt-2">
                  {["read", "write", "automation"].map((risk) => (
                    <Button
                      key={risk}
                      type="button"
                      variant={formData.risk_type === risk ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, risk_type: risk })}
                      className="flex-1"
                    >
                      {risk}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Input Schema</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplateJSON("input")}
                  >
                    Insert Template JSON
                  </Button>
                </div>
                <Textarea
                  placeholder='{"type": "object", "properties": {...}}'
                  rows={8}
                  className="font-mono text-sm"
                  value={formData.input_schema}
                  onChange={(e) => setFormData({ ...formData, input_schema: e.target.value })}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Output Schema</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplateJSON("output")}
                  >
                    Insert Template JSON
                  </Button>
                </div>
                <Textarea
                  placeholder='{"type": "object", "properties": {...}}'
                  rows={8}
                  className="font-mono text-sm"
                  value={formData.output_schema}
                  onChange={(e) => setFormData({ ...formData, output_schema: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="data-sensitivity">Data Sensitivity</Label>
                <Select
                  value={formData.data_sensitivity}
                  onValueChange={(value) => setFormData({ ...formData, data_sensitivity: value })}
                >
                  <SelectTrigger id="data-sensitivity">
                    <SelectValue placeholder="Select sensitivity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="pii">PII</SelectItem>
                    <SelectItem value="secrets">Secrets</SelectItem>
                    <SelectItem value="config_change">Config Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requires-approval">Requires Human Approval</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable for high-risk operations
                  </p>
                </div>
                <Switch
                  id="requires-approval"
                  checked={formData.requires_approval}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, requires_approval: checked })
                  }
                />
              </div>

              <div>
                <Label>Allowed Contexts</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ALLOWED_CONTEXTS.map((context) => (
                    <Badge
                      key={context}
                      variant={
                        formData.allowed_contexts.includes(context) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleContext(context)}
                    >
                      {context}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label>Sample Payload</Label>
                <Textarea
                  placeholder='{"input": "test value"}'
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <Button variant="outline" className="w-full">
                Run Test
              </Button>

              <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-green-900 dark:text-green-200">
                    Test Result: Success
                  </p>
                  <pre className="text-xs mt-2 text-green-800 dark:text-green-300">
                    {JSON.stringify({ status: "ok", result: "mock output" }, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              <div className="text-xs text-muted-foreground">
                <p>Console log:</p>
                <pre className="bg-muted p-2 rounded mt-1">Skill invoked successfully</pre>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approval Workflow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Product PM Approval</p>
                      <p className="text-sm text-muted-foreground">
                        Review business value and product alignment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Engineering Lead Approval</p>
                      <p className="text-sm text-muted-foreground">
                        Review technical implementation and architecture
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Platform PM Approval</p>
                      <p className="text-sm text-muted-foreground">
                        Review platform governance and compliance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skill Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {formData.name || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">MCP Server:</span>{" "}
                    {selectedMCP?.name || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Risk Type:</span>{" "}
                    <Badge variant="outline">{formData.risk_type || "N/A"}</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Data Sensitivity:</span>{" "}
                    {formData.data_sensitivity || "None"}
                  </div>
                  <div>
                    <span className="font-medium">Requires Approval:</span>{" "}
                    {formData.requires_approval ? "Yes" : "No"}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>

            {step < 5 ? (
              <Button onClick={handleNext} disabled={step === 1 && !isStep1Valid}>
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
      </DialogContent>
    </Dialog>
  );
}
