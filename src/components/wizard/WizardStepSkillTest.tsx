import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Play, AlertTriangle } from "lucide-react";

interface WizardStepSkillTestProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function WizardStepSkillTest({ formData, setFormData }: WizardStepSkillTestProps) {
  const [testInput, setTestInput] = useState(formData.input_schema || "");
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    setTesting(true);
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResult({
        success,
        timestamp: new Date().toISOString(),
        response: success
          ? { status: "ok", data: "Sample successful response" }
          : { error: "Connection timeout", code: "ERR_TIMEOUT" },
      });
      setFormData({
        ...formData,
        last_test_result: success ? "success" : "failed",
        last_test_at: new Date().toISOString(),
      });
      setTesting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Test your skill to ensure it works correctly before submission.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="test-input">Test Input (JSON)</Label>
          <Textarea
            id="test-input"
            placeholder="Enter test input matching your input schema"
            rows={6}
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        <Button onClick={runTest} disabled={testing}>
          <Play className="h-4 w-4 mr-2" />
          {testing ? "Running Test..." : "Run Test"}
        </Button>

        {testResult && (
          <div className="space-y-3">
            {testResult.success ? (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Test Passed</strong> - Skill executed successfully
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/10">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <strong>Test Failed</strong> - Skill execution encountered an error
                  </AlertDescription>
                </Alert>
                <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    Skill not successfully tested; approval may be blocked.
                  </AlertDescription>
                </Alert>
              </>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Response:</p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(testResult.response, null, 2)}
              </pre>
            </div>

            <p className="text-xs text-muted-foreground">
              Tested at: {new Date(testResult.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
