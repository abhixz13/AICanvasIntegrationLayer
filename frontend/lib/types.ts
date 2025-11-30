// Database types for the MCP Integration Platform

export interface BusinessUnit {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  business_unit_id: string // Fixed from bu_id to business_unit_id
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface UserProfile {
  id: string // This is the auth.users id, not a separate user_id field
  business_unit_id: string | null // Fixed from bu_id to business_unit_id, nullable for Platform Governance
  full_name: string | null
  email: string
  onboarded: boolean // Fixed from is_primary to onboarded
  created_at: string
  updated_at: string
}

export interface UserProfileRole {
  user_profile_id: string
  role_id: string
  created_at: string
}

// Extended types with relations
export interface UserProfileWithRelations extends UserProfile {
  business_unit?: BusinessUnit
  roles?: Role[]
}
