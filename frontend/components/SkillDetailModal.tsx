import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skill } from "@/types/skill";

interface SkillDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill | null;
}

export function SkillDetailModal({ open, onOpenChange, skill }: SkillDetailModalProps) {
  if (!skill) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{skill.name}</DialogTitle>
            <Badge variant="outline" className={getLifecycleColor(skill.lifecycle_state)}>
              {skill.lifecycle_state}
            </Badge>
            <Badge variant="outline" className={getRiskColor(skill.risk_type)}>
              {skill.risk_type}
            </Badge>
          </div>
          <DialogDescription>
            MCP: {skill.mcp_server_name} • Owner: {skill.owner_team}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{skill.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Guardrails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data Sensitivity:</span>
                <Badge variant="outline">{skill.data_sensitivity}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Requires Approval:</span>
                <Badge variant={skill.requires_human_approval ? "default" : "outline"}>
                  {skill.requires_human_approval ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Allowed Contexts:</span>
                <div className="flex gap-1">
                  {skill.allowed_contexts.map((ctx) => (
                    <Badge key={ctx} variant="outline" className="text-xs">
                      {ctx}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Input Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {skill.input_schema}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Output Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {skill.output_schema}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Last Test Result</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={skill.last_test_result === "success" ? "default" : "destructive"}
              >
                {skill.last_test_result || "Not tested"}
              </Badge>
              {skill.last_test_at && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last tested: {new Date(skill.last_test_at).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
