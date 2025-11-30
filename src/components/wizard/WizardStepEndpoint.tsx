import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Terminal } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface WizardStepEndpointProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function WizardStepEndpoint({ formData, setFormData }: WizardStepEndpointProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [consoleOpen, setConsoleOpen] = useState(false);

  const authType = formData.authType || "none";

  const testConnection = async () => {
    setTesting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTestResult(Math.random() > 0.3 ? "success" : "error");
    setTesting(false);
    setConsoleOpen(true);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Configure your MCP server endpoint and authentication settings.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="endpoint-url">
            MCP Endpoint URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="endpoint-url"
            type="url"
            placeholder="https://api.example.com/mcp"
            value={formData.endpointUrl || ""}
            onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="auth-type">
            Authentication Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={authType}
            onValueChange={(value) => setFormData({ ...formData, authType: value })}
          >
            <SelectTrigger id="auth-type">
              <SelectValue placeholder="Select authentication type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="api-key">API Key</SelectItem>
              <SelectItem value="oauth2">OAuth 2.0</SelectItem>
              <SelectItem value="sso">Internal SSO</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {authType === "api-key" && (
          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter API key..."
              value={formData.apiKey || ""}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            />
          </div>
        )}

        {authType === "oauth2" && (
          <>
            <div>
              <Label htmlFor="client-id">Client ID</Label>
              <Input
                id="client-id"
                placeholder="Enter client ID..."
                value={formData.clientId || ""}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="client-secret">Client Secret</Label>
              <Input
                id="client-secret"
                type="password"
                placeholder="Enter client secret..."
                value={formData.clientSecret || ""}
                onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
              />
            </div>
          </>
        )}

        {authType === "sso" && (
          <div>
            <Label htmlFor="sso-provider">SSO Provider</Label>
            <Input
              id="sso-provider"
              placeholder="e.g., Okta, Azure AD"
              value={formData.ssoProvider || ""}
              onChange={(e) => setFormData({ ...formData, ssoProvider: e.target.value })}
            />
          </div>
        )}

        <div className="pt-4">
          <Button
            onClick={testConnection}
            disabled={testing || !formData.endpointUrl}
            className="w-full gap-2"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
        </div>

        {testResult === "success" && (
          <Alert className="border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Connection successful! Your endpoint is reachable and responding correctly.
            </AlertDescription>
          </Alert>
        )}

        {testResult === "error" && (
          <Alert className="border-error bg-error/10">
            <XCircle className="h-4 w-4 text-error" />
            <AlertDescription className="text-error">
              Connection failed. Please check your endpoint URL and authentication settings.
            </AlertDescription>
          </Alert>
        )}

        {testResult && (
          <Collapsible open={consoleOpen} onOpenChange={setConsoleOpen}>
            <Card>
              <CardHeader className="pb-3">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      Console Log
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      {consoleOpen ? "Hide" : "Show"}
                    </Button>
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-48 font-mono">
                    {testResult === "success"
                      ? `[INFO] Initiating connection test to ${formData.endpointUrl}
[INFO] Validating endpoint accessibility...
[INFO] Endpoint is reachable
[INFO] Testing authentication...
[INFO] Authentication successful
[SUCCESS] Connection test completed successfully`
                      : `[INFO] Initiating connection test to ${formData.endpointUrl}
[INFO] Validating endpoint accessibility...
[ERROR] Failed to connect to endpoint
[ERROR] Connection timeout after 30s
[ERROR] Please verify the endpoint URL is correct and accessible`}
                  </pre>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}
      </div>
    </div>
  );
}
