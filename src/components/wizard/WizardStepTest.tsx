import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Play, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface WizardStepTestProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function WizardStepTest({ formData }: WizardStepTestProps) {
  const [connectivityTest, setConnectivityTest] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [skillTests, setSkillTests] = useState<{ [key: string]: "idle" | "testing" | "success" | "error" }>({});
  const [expandedSkills, setExpandedSkills] = useState<{ [key: string]: boolean }>({});
  const [alignmentChecks, setAlignmentChecks] = useState({
    skillsSupport: false,
    riskReviewed: false,
    domainAligned: false,
  });

  const mockSkills = formData.skills || [
    { id: "1", name: "query_devices", description: "Query network devices" },
    { id: "2", name: "execute_command", description: "Execute network commands" },
  ];

  const runConnectivityTest = async () => {
    setConnectivityTest("testing");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setConnectivityTest("success");
  };

  const runSkillTest = async (skillId: string) => {
    setSkillTests({ ...skillTests, [skillId]: "testing" });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSkillTests({ ...skillTests, [skillId]: Math.random() > 0.3 ? "success" : "error" });
  };

  const toggleSkillExpand = (skillId: string) => {
    setExpandedSkills({ ...expandedSkills, [skillId]: !expandedSkills[skillId] });
  };

  const allTestsPassed =
    connectivityTest === "success" &&
    Object.values(skillTests).some((status) => status === "success") &&
    alignmentChecks.skillsSupport &&
    alignmentChecks.riskReviewed &&
    alignmentChecks.domainAligned;

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Run comprehensive tests to validate your MCP server before submission.
      </p>

      {/* Connectivity Test */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Connectivity Test</CardTitle>
            {connectivityTest !== "idle" && (
              <Badge
                variant="outline"
                className={
                  connectivityTest === "success"
                    ? "border-success text-success"
                    : connectivityTest === "error"
                    ? "border-error text-error"
                    : ""
                }
              >
                {connectivityTest === "testing" && "Testing..."}
                {connectivityTest === "success" && "Passed"}
                {connectivityTest === "error" && "Failed"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Endpoint:</span>
              <span className="ml-2 font-mono">{formData.endpointUrl || "Not set"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Auth Type:</span>
              <span className="ml-2">{formData.authType || "Not set"}</span>
            </div>
          </div>

          <Button onClick={runConnectivityTest} disabled={connectivityTest === "testing"} className="w-full gap-2">
            {connectivityTest === "testing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running Test...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Connectivity Test
              </>
            )}
          </Button>

          {connectivityTest === "success" && (
            <Alert className="border-success bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Connectivity test passed. Endpoint is reachable and responding correctly.
              </AlertDescription>
            </Alert>
          )}

          {connectivityTest === "error" && (
            <Alert className="border-error bg-error/10">
              <XCircle className="h-4 w-4 text-error" />
              <AlertDescription className="text-error">
                Connectivity test failed. Please check your endpoint configuration.
              </AlertDescription>
            </Alert>
          )}

          {connectivityTest !== "idle" && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  View Network Log
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-32 mt-2 font-mono">
                  {`[INFO] Connecting to ${formData.endpointUrl}
[INFO] Sending handshake request...
[INFO] Response received (200 OK)
[SUCCESS] Connection established`}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>

      {/* Skill Invocation Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skill Invocation Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockSkills.map((skill: any) => {
            const status = skillTests[skill.id] || "idle";
            return (
              <Card key={skill.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{skill.name}</span>
                      {status !== "idle" && (
                        <Badge
                          variant="outline"
                          className={
                            status === "success"
                              ? "border-success text-success"
                              : status === "error"
                              ? "border-error text-error"
                              : ""
                          }
                        >
                          {status === "testing" && "Testing..."}
                          {status === "success" && "Passed"}
                          {status === "error" && "Failed"}
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => runSkillTest(skill.id)}
                      disabled={status === "testing"}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      {status === "testing" ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                      Run Test
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">{skill.description}</p>

                  {status !== "idle" && (
                    <Collapsible open={expandedSkills[skill.id]}>
                      <CollapsibleTrigger
                        onClick={() => toggleSkillExpand(skill.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {expandedSkills[skill.id] ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                        {expandedSkills[skill.id] ? "Hide" : "Show"} response
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-24 font-mono">
                          {status === "success"
                            ? `{\n  "status": "success",\n  "data": {...}\n}`
                            : `{\n  "error": "Invocation failed"\n}`}
                        </pre>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Use Case Alignment Check */}
      <Card className={allTestsPassed ? "border-success" : ""}>
        <CardHeader>
          <CardTitle className="text-base">Use Case Alignment Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.useCases?.map((id: string) => (
              <Badge key={id} variant="secondary">
                Use Case {id}
              </Badge>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Checkbox
                id="align-skills"
                checked={alignmentChecks.skillsSupport}
                onCheckedChange={(checked) =>
                  setAlignmentChecks({ ...alignmentChecks, skillsSupport: checked as boolean })
                }
              />
              <Label htmlFor="align-skills" className="text-sm cursor-pointer">
                Skills support the mapped use case requirements
              </Label>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="align-risk"
                checked={alignmentChecks.riskReviewed}
                onCheckedChange={(checked) =>
                  setAlignmentChecks({ ...alignmentChecks, riskReviewed: checked as boolean })
                }
              />
              <Label htmlFor="align-risk" className="text-sm cursor-pointer">
                All risks have been reviewed and documented
              </Label>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="align-domain"
                checked={alignmentChecks.domainAligned}
                onCheckedChange={(checked) =>
                  setAlignmentChecks({ ...alignmentChecks, domainAligned: checked as boolean })
                }
              />
              <Label htmlFor="align-domain" className="text-sm cursor-pointer">
                MCP aligns with the business domain requirements
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {allTestsPassed && (
        <Alert className="border-success bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-success font-medium">
            All validation tests passed! You're ready to proceed to review and submission.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
