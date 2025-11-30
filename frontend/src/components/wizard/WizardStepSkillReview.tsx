import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface WizardStepSkillReviewProps {
  formData: any;
  mcpServerName: string;
}

export function WizardStepSkillReview({ formData, mcpServerName }: WizardStepSkillReviewProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "read":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "write":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "automation":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Review all details before submitting your skill for approval.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skill Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">MCP Server</p>
            <p className="font-medium">{mcpServerName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Skill Name</p>
            <p className="font-medium">{formData.name || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">{formData.description || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Risk Type</p>
            <Badge variant="outline" className={getRiskColor(formData.risk_type)}>
              {formData.risk_type || "—"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk & Guardrails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Data Sensitivity</p>
            <Badge variant="outline">
              {formData.data_sensitivity?.replace("_", " ") || "—"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Requires Human Approval</p>
            <Badge variant={formData.requires_human_approval ? "default" : "secondary"}>
              {formData.requires_human_approval ? "Yes" : "No"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Allowed Contexts</p>
            <div className="flex gap-2 flex-wrap">
              {formData.allowed_contexts?.map((ctx: string) => (
                <Badge key={ctx} variant="outline">
                  {ctx}
                </Badge>
              )) || "—"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schemas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Input Schema</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
              {formData.input_schema || "Not defined"}
            </pre>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Output Schema</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
              {formData.output_schema || "Not defined"}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {formData.last_test_result === "success" ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Test Passed</span>
              </>
            ) : formData.last_test_result === "failed" ? (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-600 font-medium">Test Failed</span>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Not Tested</span>
              </>
            )}
          </div>
          {formData.last_test_at && (
            <p className="text-xs text-muted-foreground mt-1">
              Last tested: {new Date(formData.last_test_at).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
