import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface WizardStepSkillRiskProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function WizardStepSkillRisk({ formData, setFormData }: WizardStepSkillRiskProps) {
  const addContext = (context: string) => {
    if (context && !formData.allowed_contexts?.includes(context)) {
      setFormData({
        ...formData,
        allowed_contexts: [...(formData.allowed_contexts || []), context],
      });
    }
  };

  const removeContext = (context: string) => {
    setFormData({
      ...formData,
      allowed_contexts: formData.allowed_contexts?.filter((c: string) => c !== context) || [],
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Configure risk settings and guardrails for this skill.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="data-sensitivity">
            Data Sensitivity <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.data_sensitivity || ""}
            onValueChange={(value) => setFormData({ ...formData, data_sensitivity: value })}
          >
            <SelectTrigger id="data-sensitivity">
              <SelectValue placeholder="Select sensitivity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None - No sensitive data</SelectItem>
              <SelectItem value="pii">PII - Personal information</SelectItem>
              <SelectItem value="secrets">Secrets - API keys, credentials</SelectItem>
              <SelectItem value="config_change">
                Config Change - System configuration
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="requires-approval" className="text-base">
              Requires Human Approval
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Enable this for high-risk operations that need manual review
            </p>
          </div>
          <Switch
            id="requires-approval"
            checked={formData.requires_human_approval || false}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, requires_human_approval: checked })
            }
          />
        </div>

        <div>
          <Label htmlFor="allowed-contexts">
            Allowed Contexts <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-2">
            <Select onValueChange={addContext}>
              <SelectTrigger id="allowed-contexts">
                <SelectValue placeholder="Add context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal-only">Internal Only</SelectItem>
                <SelectItem value="automation">Automation Allowed</SelectItem>
                <SelectItem value="external">External Facing</SelectItem>
                <SelectItem value="production">Production Environment</SelectItem>
                <SelectItem value="development">Development Environment</SelectItem>
              </SelectContent>
            </Select>

            {formData.allowed_contexts && formData.allowed_contexts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.allowed_contexts.map((context: string) => (
                  <Badge key={context} variant="secondary" className="gap-1">
                    {context}
                    <button
                      onClick={() => removeContext(context)}
                      className="hover:bg-muted rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Select where and how this skill can be invoked
          </p>
        </div>
      </div>
    </div>
  );
}
