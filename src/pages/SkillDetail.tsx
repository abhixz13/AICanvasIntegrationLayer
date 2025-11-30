import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Play, CheckCircle, XCircle, Clock } from "lucide-react";
import { mockSkills, mockSkillApprovals } from "@/data/mockSkills";
import { RiskType, LifecycleState } from "@/types/skill";

export default function SkillDetail() {
  const { id } = useParams();
  const skill = mockSkills.find((s) => s.id === id);
  const approvals = mockSkillApprovals.filter((a) => a.skill_id === id);

  const [testInput, setTestInput] = useState(skill?.input_schema || "");
  const [testResult, setTestResult] = useState<any>(null);

  if (!skill) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Skill not found</p>
      </div>
    );
  }

  const getRiskColor = (risk: RiskType) => {
    switch (risk) {
      case "read":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "write":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "automation":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  const getLifecycleColor = (lifecycle: LifecycleState) => {
    switch (lifecycle) {
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      case "in_review":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "deprecated":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  const getApprovalIcon = (action: string) => {
    switch (action) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-amber-600" />;
    }
  };

  const runTest = () => {
    setTestResult({
      success: true,
      timestamp: new Date().toISOString(),
      response: { status: "ok", data: "Sample response data" },
    });
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/skills">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{skill.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getLifecycleColor(skill.lifecycle_state)}>
              {skill.lifecycle_state.replace("_", " ")}
            </Badge>
            <Badge variant="outline" className={getRiskColor(skill.risk_type)}>
              {skill.risk_type}
            </Badge>
            <Link to={`/mcp/${skill.mcp_server_id}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                {skill.mcp_server_name}
              </Badge>
            </Link>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">New Version</Button>
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Deprecate</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schemas">Schemas</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="approvals">
            Approvals
            {approvals.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {approvals.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{skill.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Risk & Sensitivity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Risk Type</p>
                  <Badge variant="outline" className={getRiskColor(skill.risk_type)}>
                    {skill.risk_type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Data Sensitivity</p>
                  <Badge variant="outline">{skill.data_sensitivity.replace("_", " ")}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Requires Human Approval</p>
                  <Badge variant={skill.requires_human_approval ? "default" : "secondary"}>
                    {skill.requires_human_approval ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ownership</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Owner Team</p>
                  <p className="font-medium">{skill.owner_team}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Owner Email</p>
                  <p className="font-medium">{skill.owner_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Allowed Contexts</p>
                  <div className="flex gap-2 flex-wrap">
                    {skill.allowed_contexts.map((ctx) => (
                      <Badge key={ctx} variant="outline">
                        {ctx}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schemas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Input Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                {skill.input_schema}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                {skill.output_schema}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Call Volume (7d)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{skill.call_volume_7d.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-3xl font-bold ${
                    skill.success_rate >= 95 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {skill.success_rate.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Last Incident</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  {skill.last_incident_at
                    ? new Date(skill.last_incident_at).toLocaleDateString()
                    : "None"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Templates/Agents Using This Skill</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                4 templates and 12 agent instances are using this skill
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Last Test Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {skill.last_test_result === "success" ? (
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    Success
                  </Badge>
                ) : skill.last_test_result === "failed" ? (
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    Failed
                  </Badge>
                ) : (
                  <Badge variant="outline">Not Tested</Badge>
                )}
                {skill.last_test_at && (
                  <span className="text-sm text-muted-foreground">
                    {new Date(skill.last_test_at).toLocaleString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Run Test Again</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Test Input (JSON)</label>
                <Textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>

              <Button onClick={runTest}>
                <Play className="h-4 w-4 mr-2" />
                Run Test
              </Button>

              {testResult && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Test Result:</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">v1.0</TableCell>
                    <TableCell>Initial creation</TableCell>
                    <TableCell>{skill.owner_email}</TableCell>
                    <TableCell>{new Date(skill.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          {skill.lifecycle_state === "in_review" && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
              <CardContent className="pt-6">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  This skill is pending approval from {approvals.length} reviewer(s).
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Required Approvers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell className="font-medium">{approval.approver_role}</TableCell>
                      <TableCell>{approval.approver_email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getApprovalIcon(approval.action)}
                          <span className="capitalize">{approval.action}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {approval.comments || "—"}
                      </TableCell>
                      <TableCell>
                        {new Date(approval.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {approval.action === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
