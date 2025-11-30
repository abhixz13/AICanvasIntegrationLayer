import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

interface WizardStepSkillSchemasProps {
  formData: any;
  setFormData: (data: any) => void;
}

const schemaTemplates = {
  simple_object: JSON.stringify(
    { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    null,
    2
  ),
  array: JSON.stringify(
    { type: "array", items: { type: "object", properties: { name: { type: "string" } } } },
    null,
    2
  ),
  success_response: JSON.stringify(
    { type: "object", properties: { success: { type: "boolean" }, message: { type: "string" } } },
    null,
    2
  ),
};

export function WizardStepSkillSchemas({ formData, setFormData }: WizardStepSkillSchemasProps) {
  const [inputValid, setInputValid] = useState<boolean | null>(null);
  const [outputValid, setOutputValid] = useState<boolean | null>(null);

  const validateJSON = (value: string, type: "input" | "output") => {
    try {
      JSON.parse(value);
      if (type === "input") {
        setInputValid(true);
      } else {
        setOutputValid(true);
      }
    } catch {
      if (type === "input") {
        setInputValid(false);
      } else {
        setOutputValid(false);
      }
    }
  };

  const insertTemplate = (template: string, type: "input" | "output") => {
    if (type === "input") {
      setFormData({ ...formData, input_schema: template });
      setInputValid(true);
    } else {
      setFormData({ ...formData, output_schema: template });
      setOutputValid(true);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Define the input and output schemas for your skill using JSON Schema format.
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="input-schema">Input Schema (JSON)</Label>
            <Select
              onValueChange={(value) => insertTemplate(schemaTemplates[value as keyof typeof schemaTemplates], "input")}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Insert Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple_object">Simple Object</SelectItem>
                <SelectItem value="array">Array</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            id="input-schema"
            placeholder='{"type": "object", "properties": {...}}'
            rows={8}
            value={formData.input_schema || ""}
            onChange={(e) => {
              setFormData({ ...formData, input_schema: e.target.value });
              validateJSON(e.target.value, "input");
            }}
            className="font-mono text-xs"
          />
          {inputValid === true && (
            <Alert className="mt-2 border-green-200 bg-green-50 dark:bg-green-900/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Valid JSON schema
              </AlertDescription>
            </Alert>
          )}
          {inputValid === false && (
            <Alert className="mt-2 border-red-200 bg-red-50 dark:bg-red-900/10">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                Invalid JSON format
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="output-schema">Output Schema (JSON)</Label>
            <Select
              onValueChange={(value) => insertTemplate(schemaTemplates[value as keyof typeof schemaTemplates], "output")}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Insert Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple_object">Simple Object</SelectItem>
                <SelectItem value="array">Array</SelectItem>
                <SelectItem value="success_response">Success Response</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            id="output-schema"
            placeholder='{"type": "object", "properties": {...}}'
            rows={8}
            value={formData.output_schema || ""}
            onChange={(e) => {
              setFormData({ ...formData, output_schema: e.target.value });
              validateJSON(e.target.value, "output");
            }}
            className="font-mono text-xs"
          />
          {outputValid === true && (
            <Alert className="mt-2 border-green-200 bg-green-50 dark:bg-green-900/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Valid JSON schema
              </AlertDescription>
            </Alert>
          )}
          {outputValid === false && (
            <Alert className="mt-2 border-red-200 bg-red-50 dark:bg-red-900/10">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                Invalid JSON format
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
