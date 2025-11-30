import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

interface WizardStepBasicsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function WizardStepBasics({ formData, setFormData }: WizardStepBasicsProps) {
  const [currentTag, setCurrentTag] = useState("");
  const tags = formData.tags || [];

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData({ ...formData, tags: [...tags, currentTag.trim()] });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: tags.filter((tag: string) => tag !== tagToRemove) });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Provide basic information about your MCP server. All required fields must be completed to
        proceed.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">
            MCP Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Network Operations MCP"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe what this MCP server does..."
            rows={4}
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="business-unit">
            Business Unit <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.businessUnit || ""}
            onValueChange={(value) => setFormData({ ...formData, businessUnit: value })}
          >
            <SelectTrigger id="business-unit">
              <SelectValue placeholder="Select business unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="netops">Network Operations</SelectItem>
              <SelectItem value="secops">Security Operations</SelectItem>
              <SelectItem value="cloudops">Cloud Operations</SelectItem>
              <SelectItem value="appops">Application Operations</SelectItem>
              <SelectItem value="dcops">Data Center Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="owner-team">Owner Team Emails</Label>
          <Input
            id="owner-team"
            placeholder="team@example.com, team2@example.com"
            value={formData.ownerTeam || ""}
            onChange={(e) => setFormData({ ...formData, ownerTeam: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Comma-separated list of team email addresses
          </p>
        </div>

        <div>
          <Label htmlFor="primary-contact">
            Primary Contact <span className="text-destructive">*</span>
          </Label>
          <Input
            id="primary-contact"
            type="email"
            placeholder="contact@example.com"
            value={formData.primaryContact || ""}
            onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="domain">Domain</Label>
          <Select
            value={formData.domain || ""}
            onValueChange={(value) => setFormData({ ...formData, domain: value })}
          >
            <SelectTrigger id="domain">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="netops">NetOps</SelectItem>
              <SelectItem value="secops">SecOps</SelectItem>
              <SelectItem value="cloudops">CloudOps</SelectItem>
              <SelectItem value="appops">AppOps</SelectItem>
              <SelectItem value="dcops">DC Ops</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add a tag..."
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} variant="secondary">
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
