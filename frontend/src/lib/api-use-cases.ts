"use server"

import { createClient } from "@/lib/supabase/server"

export interface BusinessUseCase {
  id: string
  title: string
  description: string | null
  bu_id: string | null
  status: "draft" | "pending_product_admin" | "pending_platform_admin" | "active" | "rejected" | "archived"
  owner_email: string
  skill_count: number
  mcp_server_count: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface UseCaseApproval {
  id: string
  use_case_id: string
  approver_role: "product_admin" | "platform_admin"
  approver_email: string
  action: "approved" | "rejected"
  comments: string | null
  created_at: string
}

export async function fetchUseCases(buId?: string): Promise<BusinessUseCase[]> {
  try {
    const supabase = await createClient()

    let query = supabase.from("business_use_cases").select("*").order("created_at", { ascending: false })

    if (buId && buId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      query = query.eq("bu_id", buId)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching use cases:", error)
      // Return empty array instead of throwing to prevent crashes
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error fetching use cases:", error)
    return []
  }
}

export async function fetchUseCaseById(id: string): Promise<BusinessUseCase | null> {
  const supabase = await createClient()

  const { data: useCase, error: useCaseError } = await supabase
    .from("business_use_cases")
    .select("*")
    .eq("id", id)
    .single()

  if (useCaseError) {
    console.error("[v0] Error fetching use case:", useCaseError)
    return null
  }

  return useCase
}

// Create a new use case
export async function createUseCase(
  useCase: Omit<BusinessUseCase, "id" | "created_at" | "updated_at">,
): Promise<BusinessUseCase> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("business_use_cases").insert([useCase]).select().single()

  if (error) {
    console.error("[v0] Error creating use case:", error)
    throw error
  }

  return data
}

// Update use case
export async function updateUseCase(id: string, updates: Partial<BusinessUseCase>): Promise<BusinessUseCase> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("business_use_cases")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating use case:", error)
    throw error
  }

  return data
}

// Approve or reject a use case
export async function approveUseCase(
  useCaseId: string,
  approverRole: "product_admin" | "platform_admin",
  approverEmail: string,
  action: "approved" | "rejected",
  comments?: string,
): Promise<void> {
  const supabase = await createClient()

  // Add approval record
  const { error: approvalError } = await supabase.from("use_case_approvals").insert([
    {
      use_case_id: useCaseId,
      approver_role: approverRole,
      approver_email: approverEmail,
      action,
      comments: comments || null,
    },
  ])

  if (approvalError) {
    console.error("[v0] Error creating approval:", approvalError)
    throw approvalError
  }

  // Update use case status
  let newStatus: BusinessUseCase["status"]

  if (action === "rejected") {
    newStatus = "rejected"
  } else if (approverRole === "product_admin") {
    newStatus = "pending_platform_admin"
  } else {
    newStatus = "active"
  }

  const { error: updateError } = await supabase
    .from("business_use_cases")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", useCaseId)

  if (updateError) {
    console.error("[v0] Error updating use case status:", updateError)
    throw updateError
  }
}

// Fetch approvals for a use case
export async function fetchApprovals(useCaseId: string): Promise<UseCaseApproval[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("use_case_approvals")
    .select("*")
    .eq("use_case_id", useCaseId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching approvals:", error)
    throw error
  }

  return data || []
}
