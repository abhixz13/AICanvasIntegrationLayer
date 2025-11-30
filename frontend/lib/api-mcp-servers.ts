"use server"

import { createClient } from "@/lib/supabase/server"

export interface McpServer {
  id: string
  name: string
  description: string | null
  bu_id: string
  business_use_case_id: string
  endpoint_url: string
  auth_type: "none" | "api_key" | "oauth" | "basic"
  lifecycle_state: "draft" | "in_review" | "active" | "deprecated" | "archived"
  test_status: "passing" | "failing" | "unknown" | null
  last_test_run: string | null
  owner_email: string
  owner_team: string
  tags: string[]
  deprecation_reason?: string
  created_at: string
  updated_at: string
}

export async function fetchMcpServers(buId?: string): Promise<McpServer[]> {
  try {
    const supabase = await createClient()

    let query = supabase.from("mcp_servers").select("*").order("created_at", { ascending: false })

    if (buId && buId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      query = query.eq("bu_id", buId)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching MCP servers:", error)
      return []
    }

    // MOCK DATA FOR PROTOTYPING: Dev MCP with no use case
    const mockDevServer: McpServer = {
      id: "mock-dev-server-1",
      name: "Dev Prototype MCP",
      description: "A prototype MCP server in development environment",
      bu_id: "bu-1", // Assuming 'bu-1' exists or will be mapped
      business_use_case_id: "", // No use case attached
      endpoint_url: "https://dev.api.example.com/mcp",
      auth_type: "api_key",
      lifecycle_state: "draft",
      test_status: "passing",
      last_test_run: new Date().toISOString(),
      owner_email: "dev@example.com",
      owner_team: "Platform Engineering",
      tags: ["prototype", "dev"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const allServers = data ? [mockDevServer, ...data] : [mockDevServer]

    return (allServers as McpServer[]) || []
  } catch (error) {
    console.error("[v0] Unexpected error fetching MCP servers:", error)
    return []
  }
}

/**
 * Fetches MCP servers for external consumers (Canvas/C3).
 * Enforces strict filtering:
 * 1. Lifecycle must be Active (Approved)
 */
export async function fetchPublicMcpServers(): Promise<McpServer[]> {
  const servers = await fetchMcpServers()
  return servers.filter((server) => server.lifecycle_state === "active")
}

export async function fetchMcpServerById(id: string): Promise<McpServer | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("mcp_servers").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching MCP server:", error)
    return null
  }

  return data
}

export async function createMcpServer(
  server: Omit<McpServer, "id" | "created_at" | "updated_at">,
): Promise<McpServer | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("mcp_servers").insert([server]).select().single()

  if (error) {
    console.error("[v0] Error creating MCP server:", error)
    throw error
  }

  return data
}

export async function updateMcpServer(id: string, updates: Partial<McpServer>): Promise<McpServer | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("mcp_servers")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating MCP server:", error)
    throw error
  }

  return data
}

export async function deleteMcpServer(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.from("mcp_servers").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting MCP server:", error)
    return false
  }

  return true
}
