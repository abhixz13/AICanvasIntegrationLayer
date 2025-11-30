import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface WizardStepSkillBasicsProps {
  formData: any;
  setFormData: (data: any) => void;
  mcpServerName: string;
}

export function WizardStepSkillBasics({
  formData,
  setFormData,
  mcpServerName,
}: WizardStepSkillBasicsProps) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Define the basic properties of your skill.
      </p>

      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
        <CardContent className="pt-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
              MCP Server Association
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              This skill belongs to MCP: <strong>{mcpServerName}</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <Label htmlFor="skill-name">
            Skill Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="skill-name"
            placeholder="e.g., list_devices, restart_service"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="skill-description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="skill-description"
            placeholder="Describe what this skill does and when it should be used"
            rows={3}
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="risk-type">
            Risk Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.risk_type || ""}
            onValueChange={(value) => setFormData({ ...formData, risk_type: value })}
          >
            <SelectTrigger id="risk-type">
              <SelectValue placeholder="Select risk type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="read">Read - Data retrieval only</SelectItem>
              <SelectItem value="write">Write - Data modification</SelectItem>
              <SelectItem value="automation">
                Automation - Autonomous actions
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Read: Safe queries | Write: Data changes | Automation: Critical operations
          </p>
        </div>
      </div>
    </div>
  );
}
