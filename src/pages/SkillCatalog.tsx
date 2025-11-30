import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, AlertTriangle } from "lucide-react";
import { mockSkills } from "@/data/mockSkills";
import { Skill, RiskType, LifecycleState } from "@/types/skill";

export default function SkillCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filteredSkills = mockSkills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.mcp_server_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.owner_team.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLifecycle =
      lifecycleFilter === "all" || skill.lifecycle_state === lifecycleFilter;

    const matchesRisk = riskFilter === "all" || skill.risk_type === riskFilter;

    return matchesSearch && matchesLifecycle && matchesRisk;
  });

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

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Skill Catalog</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all skills across MCP servers
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by skill, MCP, owner, BU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={lifecycleFilter} onValueChange={setLifecycleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lifecycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lifecycles</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="deprecated">Deprecated</SelectItem>
          </SelectContent>
        </Select>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Risk Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Types</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="write">Write</SelectItem>
            <SelectItem value="automation">Automation</SelectItem>
          </SelectContent>
        </Select>
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
              <TableHead>Last Incident</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSkills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No skills found
                </TableCell>
              </TableRow>
            ) : (
              filteredSkills.map((skill) => (
                <TableRow key={skill.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link
                      to={`/skills/${skill.id}`}
                      className="font-medium text-foreground hover:text-primary flex items-center gap-2"
                    >
                      {skill.name}
                      {hasWarning(skill) && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </Link>
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
                    {skill.last_incident_at
                      ? new Date(skill.last_incident_at).toLocaleDateString()
                      : "None"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Skill</DropdownMenuItem>
                        <DropdownMenuItem>Run Test</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
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
    </div>
  );
}
