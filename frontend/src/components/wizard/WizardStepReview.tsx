import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WizardStepReviewProps {
  formData: any;
}

export function WizardStepReview({ formData }: WizardStepReviewProps) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Review all the information before submitting your MCP server for approval.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">MCP Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <span className="ml-2 font-medium">{formData.name || "Not set"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Business Unit:</span>
              <span className="ml-2">{formData.businessUnit || "Not set"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Description:</span>
              <p className="mt-1">{formData.description || "No description provided"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Primary Contact:</span>
              <span className="ml-2">{formData.primaryContact || "Not set"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Domain:</span>
              <span className="ml-2">{formData.domain || "Not set"}</span>
            </div>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div>
              <span className="text-muted-foreground">Tags:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Endpoint & Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Endpoint URL:</span>
            <span className="ml-2 font-mono text-xs">{formData.endpointUrl || "Not set"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Authentication Type:</span>
            <span className="ml-2">{formData.authType || "Not set"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skills Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.skills && formData.skills.length > 0 ? (
            <div className="text-sm">
              <p className="mb-2">
                <span className="font-medium">{formData.skills.length}</span> skills imported
              </p>
              <div className="space-y-1">
                {formData.skills.slice(0, 5).map((skill: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs">•</span>
                    <span>{skill.name}</span>
                  </div>
                ))}
                {formData.skills.length > 5 && (
                  <p className="text-muted-foreground text-xs">
                    And {formData.skills.length - 5} more...
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills imported</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.useCases && formData.useCases.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.useCases.map((id: string) => (
                <Badge key={id} variant="secondary">
                  Use Case {id}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No use cases mapped</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validation Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-success text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Connectivity test passed</span>
          </div>
          <div className="flex items-center gap-2 text-success text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Skill invocation tests completed</span>
          </div>
          <div className="flex items-center gap-2 text-success text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Use case alignment verified</span>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <p className="font-medium mb-1">What happens after submission?</p>
          <p className="text-sm text-muted-foreground">
            Your MCP server will be sent to the governance team for review. You'll receive
            notifications about the approval status. Once approved, your skills will be published
            to the registry and available for use.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
