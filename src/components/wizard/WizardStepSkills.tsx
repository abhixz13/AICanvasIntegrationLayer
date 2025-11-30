import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileJson, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WizardStepSkillsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function WizardStepSkills({ formData, setFormData }: WizardStepSkillsProps) {
  const [manifestJson, setManifestJson] = useState("");
  const [skills, setSkills] = useState<any[]>(formData.skills || []);

  const parseManifest = () => {
    try {
      const parsed = JSON.parse(manifestJson);
      const importedSkills = parsed.skills || [];
      setSkills(importedSkills);
      setFormData({ ...formData, skills: importedSkills });
    } catch (error) {
      console.error("Failed to parse manifest:", error);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "read":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "write":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "automation":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const skillsSummary = {
    total: skills.length,
    read: skills.filter((s) => s.risk === "read").length,
    write: skills.filter((s) => s.risk === "write").length,
    automation: skills.filter((s) => s.risk === "automation").length,
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Import your MCP skills by uploading or pasting the manifest JSON file.
      </p>

      <Tabs defaultValue="paste" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Manifest JSON</TabsTrigger>
          <TabsTrigger value="paste">Paste Manifest JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-2">Drop your manifest.json file here</p>
                <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
                <Button variant="outline">
                  <FileJson className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paste" className="space-y-4">
          <div>
            <Label htmlFor="manifest-json">Manifest JSON</Label>
            <Textarea
              id="manifest-json"
              placeholder="Paste your MCP manifest JSON here..."
              rows={8}
              value={manifestJson}
              onChange={(e) => setManifestJson(e.target.value)}
              className="font-mono text-xs"
            />
          </div>
          <Button onClick={parseManifest} className="w-full">
            Parse and Import Skills
          </Button>
        </TabsContent>
      </Tabs>

      {skills.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium">
                  {skillsSummary.total} skills imported:
                </span>
                <Badge variant="outline" className={getRiskBadgeColor("read")}>
                  {skillsSummary.read}R
                </Badge>
                <Badge variant="outline" className={getRiskBadgeColor("write")}>
                  {skillsSummary.write}W
                </Badge>
                <Badge variant="outline" className={getRiskBadgeColor("automation")}>
                  {skillsSummary.automation}A
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Imported Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Risk Type</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills.map((skill, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{skill.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {skill.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRiskBadgeColor(skill.risk)}>
                          {skill.risk}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
