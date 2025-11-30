
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import Link from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, AlertTriangle } from "lucide-react";
import { mockMCPs } from "@/lib/data/mockMCPs";
import { mockSkills } from "@/lib/data/mockSkills";
import { SkillCreationDrawer } from "@/components/SkillCreationDrawer";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MCPDetail() {
  const { id } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [skills, setSkills] = useState(mockSkills);
  const [banner, setBanner] = useState<{ message: string; type: "success" | "info" } | null>(
    null
  );

  const mcp = mockMCPs.find((m) => m.id === id);
  const mcpSkills = skills.filter((s) => s.mcp_server_id === id);

  if (!mcp) {
    return (
      <div className="p-8">
        <p>MCP Server not found</p>
      </div>
    );
  }

  const handleSkillCreated = (skill: any) => {
    setSkills([...skills, skill]);
    setBanner({
      message:
        skill.lifecycle_state === "draft"
          ? "Skill saved as draft."
          : "Skill submitted for approval.",
      type: "success",
    });
    setTimeout(() => setBanner(null), 5000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "read":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "write":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "automation":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "";
    }
  };

  const getLifecycleColor = (lifecycle: string) => {
    switch (lifecycle) {
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      case "in_review":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "deprecated":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "";
    }
  };

  const hasWarning = (skill: any) => {
    return (
      skill.last_test_result === "failed" ||
      skill.success_rate < 95 ||
      skill.lifecycle_state === "draft" ||
      skill.lifecycle_state === "in_review"
    );
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/mcp">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Button>
        </Link>
      </div>

      {banner && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
          <AlertDescription className="text-green-900 dark:text-green-200">
            {banner.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{mcp.name}</h1>
          <p className="text-muted-foreground mt-1">{mcp.description}</p>
        </div>
        <Badge variant="outline" className={getLifecycleColor(mcp.lifecycle_state)}>
          {mcp.lifecycle_state}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills ({mcpSkills.length})</TabsTrigger>
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Endpoint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-mono text-muted-foreground">{mcp.endpoint_url}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{mcp.auth_type}</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{mcp.owner_team}</p>
                <p className="text-xs text-muted-foreground">{mcp.owner_email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{mcp.domain}</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Manage skills provided by this MCP server
            </p>
            <Button onClick={() => setDrawerOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Skill
            </Button>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill Name</TableHead>
                  <TableHead>Lifecycle</TableHead>
                  <TableHead>Risk Type</TableHead>
                  <TableHead className="text-right">Call Volume (7d)</TableHead>
                  <TableHead className="text-right">Success Rate</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mcpSkills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No skills found. Click "New Skill" to add one.
                    </TableCell>
                  </TableRow>
                ) : (
                  mcpSkills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/skills/${skill.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {skill.name}
                          </Link>
                          {hasWarning(skill) && (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getLifecycleColor(skill.lifecycle_state)}>
                          {skill.lifecycle_state.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRiskColor(skill.risk_type)}>
                          {skill.risk_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {skill.call_volume_7d?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            (skill.success_rate || 0) >= 95
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {skill.success_rate?.toFixed(1) || 0}%
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(skill.updated_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="use-cases">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Use case mapping coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Validation results coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SkillCreationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mcpServerName={mcp.name}
        onSkillCreated={handleSkillCreated}
      />
    </div>
  );
}
