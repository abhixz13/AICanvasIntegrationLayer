"use client"

import { useUserContext } from "./use-user-context"

export interface ActiveProfile {
  buId: string
  buName: string
  roleIds: string[]
}

// Normalize role names from database format to internal format
function normalizeRoleName(raw: string): string {
  const trimmed = raw.trim().toLowerCase()

  if (trimmed === "publisher") return "publisher"
  if (trimmed === "product admin" || trimmed === "product_admin") return "product_admin"
  if (trimmed === "engineering admin" || trimmed === "engineering_admin") return "engineering_admin"
  if (trimmed === "platform governance" || trimmed === "platform_governance") return "platform_governance"

  return trimmed
}

// Map UUID BU IDs to simplified mock IDs
function mapBUToSimplifiedId(buName: string | null): string {
  if (!buName) return ""

  const normalized = buName.toLowerCase()
  if (normalized.includes("networking") || normalized.includes("intersight")) return "bu-is"
  if (normalized.includes("meraki")) return "bu-mr"
  if (normalized.includes("observability") || normalized.includes("thousandeyes")) return "bu-te"
  if (normalized.includes("security")) return "bu-sec"

  return ""
}

export function useActiveProfile(): ActiveProfile | null {
  const { profile, businessUnit, roles, isLoading } = useUserContext()

  if (isLoading || !profile) {
    return null
  }

  // Normalize role IDs
  const roleIds = roles.map((role) => normalizeRoleName(role.name))

  // For Platform Governance users without a BU, use empty string
  const buId = businessUnit ? mapBUToSimplifiedId(businessUnit.name) : ""
  const buName = businessUnit?.name || ""

  return {
    buId,
    buName,
    roleIds,
  }
}
