export interface MCPServer {
  id: string;
  name: string;
  description: string;
  endpoint_url: string;
  auth_type: string;
  lifecycle_state: "draft" | "in_review" | "approved" | "deprecated";
  owner_email: string;
  owner_team: string;
  domain: string;
  tags: string[];
  test_status: "success" | "failed" | null;
  last_test_run: string | null;
  created_at: string;
  updated_at: string;
}

export const mockMCPs: MCPServer[] = [
  {
    id: "mcp-1",
    name: "Network Automation MCP",
    description: "Automates network device management and monitoring",
    endpoint_url: "https://api.example.com/mcp/network",
    auth_type: "API Key",
    lifecycle_state: "approved",
    owner_email: "netops@company.com",
    owner_team: "NetOps",
    domain: "NetOps",
    tags: ["network", "automation", "critical"],
    test_status: "success",
    last_test_run: "2025-11-28T10:30:00Z",
    created_at: "2025-10-15T08:00:00Z",
    updated_at: "2025-11-28T10:30:00Z",
  },
  {
    id: "mcp-2",
    name: "Cloud Ops MCP",
    description: "Manages cloud infrastructure and scaling operations",
    endpoint_url: "https://api.example.com/mcp/cloud",
    auth_type: "OAuth2",
    lifecycle_state: "approved",
    owner_email: "cloudops@company.com",
    owner_team: "CloudOps",
    domain: "CloudOps",
    tags: ["cloud", "infrastructure"],
    test_status: "success",
    last_test_run: "2025-11-29T09:15:00Z",
    created_at: "2025-09-20T10:00:00Z",
    updated_at: "2025-11-29T09:15:00Z",
  },
  {
    id: "mcp-3",
    name: "Security Ops MCP",
    description: "Security monitoring and incident response automation",
    endpoint_url: "https://api.example.com/mcp/security",
    auth_type: "Internal SSO",
    lifecycle_state: "approved",
    owner_email: "secops@company.com",
    owner_team: "SecOps",
    domain: "SecOps",
    tags: ["security", "compliance"],
    test_status: "success",
    last_test_run: "2025-11-29T08:00:00Z",
    created_at: "2025-08-10T12:00:00Z",
    updated_at: "2025-11-29T08:00:00Z",
  },
];
