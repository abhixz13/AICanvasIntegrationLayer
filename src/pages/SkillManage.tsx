import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewSkillWizard } from "@/components/NewSkillWizard";

export default function SkillManage() {
  const [wizardOpen, setWizardOpen] = useState(false);

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

      <div className="rounded-lg border bg-card p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Create Your First Skill</h2>
          <p className="text-muted-foreground">
            Skills are the building blocks of your MCP servers. Create a new skill to get started.
          </p>
          <Button onClick={() => setWizardOpen(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create New Skill
          </Button>
        </div>
      </div>

      <NewSkillWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}
