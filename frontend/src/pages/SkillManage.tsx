
import { useState } from "react";
import Link from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewSkillWizard } from "@/components/NewSkillWizard";
import { SkillDetailModal } from "@/components/SkillDetailModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, AlertTriangle, MoreVertical, Eye, Copy, AlertCircle } from "lucide-react";
import { mockSkills } from "@/lib/data/mockSkills";
import { Skill, RiskType, LifecycleState } from "@/lib/types/skill";
import { toast } from "sonner";

export default function SkillManage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const hasWarning = (skill: Skill) => {
    return (
      skill.last_test_result === "failed" ||
      skill.success_rate < 95 ||
      skill.lifecycle_state === "draft" ||
      skill.lifecycle_state === "in_review"
    );
  };

  const handleShowDetail = (skill: Skill) => {
    setSelectedSkill(skill);
    setModalOpen(true);
  };

  const handleCloneModify = (skill: Skill) => {
    toast.success(`Cloning skill: ${skill.name}`);
  };

  const handleDeprecate = (skill: Skill) => {
    toast.success(`Skill "${skill.name}" has been deprecated`);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Skills</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage skills across MCP servers
          </p>
        </div>
        <Button onClick={() => setWizardOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Skill
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill Name</TableHead>
              <TableHead>MCP Server</TableHead>
              <TableHead>Lifecycle</TableHead>
              <TableHead>Risk Type</TableHead>
              <TableHead className="text-right">Call Volume (7d)</TableHead>
              <TableHead className="text-right">Success Rate</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSkills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No skills found
                </TableCell>
              </TableRow>
            ) : (
              mockSkills.map((skill) => (
                <TableRow key={skill.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium text-foreground flex items-center gap-2">
                      {skill.name}
                      {hasWarning(skill) && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link to={`/mcp/${skill.mcp_server_id}`}>
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        {skill.mcp_server_name}
                      </Badge>
                    </Link>
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
                    {skill.call_volume_7d.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        skill.success_rate >= 95
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {skill.success_rate.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(skill.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleShowDetail(skill)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Show Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCloneModify(skill)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Clone & Modify
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeprecate(skill)}
                          className="text-destructive"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Deprecate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <NewSkillWizard open={wizardOpen} onOpenChange={setWizardOpen} />
      <SkillDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        skill={selectedSkill}
      />
    </div>
  );
}
