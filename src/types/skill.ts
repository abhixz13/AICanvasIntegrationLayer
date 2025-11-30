export type RiskType = "read" | "write" | "automation";
export type LifecycleState = "draft" | "in_review" | "approved" | "deprecated";
export type DataSensitivity = "none" | "pii" | "secrets" | "config_change";

export interface Skill {
  id: string;
  mcp_server_id: string;
  mcp_server_name: string;
  name: string;
  description: string;
  risk_type: RiskType;
  lifecycle_state: LifecycleState;
  data_sensitivity: DataSensitivity;
  requires_human_approval: boolean;
  allowed_contexts: string[];
  input_schema: string;
  output_schema: string;
  last_test_result: "success" | "failed" | null;
  last_test_at: string | null;
  owner_email: string;
  owner_team: string;
  call_volume_7d: number;
  success_rate: number;
  last_incident_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillApproval {
  id: string;
  skill_id: string;
  approver_email: string;
  approver_role: string;
  action: "approved" | "rejected" | "pending";
  comments: string | null;
  created_at: string;
}

export interface SkillVersion {
  id: string;
  skill_id: string;
  version_number: number;
  changes: string;
  created_by: string;
  created_at: string;
}
