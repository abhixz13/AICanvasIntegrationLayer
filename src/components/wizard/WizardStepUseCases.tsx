import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";

interface WizardStepUseCasesProps {
  formData: any;
  setFormData: (data: any) => void;
}

const mockUseCases = [
  {
    id: "1",
    name: "Network Incident Response",
    domain: "NetOps",
    lifecycle: "approved",
    bu: "Network Operations",
  },
  {
    id: "2",
    name: "Security Threat Analysis",
    domain: "SecOps",
    lifecycle: "approved",
    bu: "Security Operations",
  },
  {
    id: "3",
    name: "Cloud Resource Optimization",
    domain: "CloudOps",
    lifecycle: "draft",
    bu: "Cloud Operations",
  },
];

export function WizardStepUseCases({ formData, setFormData }: WizardStepUseCasesProps) {
  const [search, setSearch] = useState("");
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>(
    formData.useCases || []
  );
  const [riskChecks, setRiskChecks] = useState({
    dangerous: false,
    guardrails: false,
    aligned: false,
  });

  const toggleUseCase = (id: string) => {
    const updated = selectedUseCases.includes(id)
      ? selectedUseCases.filter((ucId) => ucId !== id)
      : [...selectedUseCases, id];
    setSelectedUseCases(updated);
    setFormData({ ...formData, useCases: updated });
  };

  const filteredUseCases = mockUseCases.filter((uc) =>
    uc.name.toLowerCase().includes(search.toLowerCase())
  );

  const allChecked = riskChecks.dangerous && riskChecks.guardrails && riskChecks.aligned;

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Map your MCP server to relevant business use cases and confirm risk alignment.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Available Use Cases</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search use cases..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Lifecycle</TableHead>
                    <TableHead>Owning BU</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUseCases.map((useCase) => (
                    <TableRow key={useCase.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUseCases.includes(useCase.id)}
                          onCheckedChange={() => toggleUseCase(useCase.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{useCase.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{useCase.domain}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={useCase.lifecycle} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {useCase.bu}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attached Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedUseCases.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No use cases selected yet
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedUseCases.map((id) => {
                    const useCase = mockUseCases.find((uc) => uc.id === id);
                    return useCase ? (
                      <div
                        key={id}
                        className="text-sm p-2 bg-muted rounded flex items-center justify-between"
                      >
                        <span>{useCase.name}</span>
                        <button
                          onClick={() => toggleUseCase(id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className={allChecked ? "border-success" : ""}>
        <CardHeader>
          <CardTitle className="text-base">Risk Confirmation Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <Checkbox
              id="check-dangerous"
              checked={riskChecks.dangerous}
              onCheckedChange={(checked) =>
                setRiskChecks({ ...riskChecks, dangerous: checked as boolean })
              }
            />
            <Label htmlFor="check-dangerous" className="text-sm cursor-pointer">
              I have reviewed all dangerous operations (Write/Automation skills) and confirmed they
              are necessary for the mapped use cases
            </Label>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="check-guardrails"
              checked={riskChecks.guardrails}
              onCheckedChange={(checked) =>
                setRiskChecks({ ...riskChecks, guardrails: checked as boolean })
              }
            />
            <Label htmlFor="check-guardrails" className="text-sm cursor-pointer">
              Appropriate guardrails and approval workflows exist for high-risk operations
            </Label>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="check-aligned"
              checked={riskChecks.aligned}
              onCheckedChange={(checked) =>
                setRiskChecks({ ...riskChecks, aligned: checked as boolean })
              }
            />
            <Label htmlFor="check-aligned" className="text-sm cursor-pointer">
              All skills align with the business intent of the selected use cases
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
