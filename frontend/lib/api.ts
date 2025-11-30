// API functions for interacting with Supabase
import { createClient } from "@/lib/supabase/client"
import type { BusinessUnit, Product, Role, UserProfile } from "@/lib/types"

// Get all business units
export async function getBusinessUnits(): Promise<BusinessUnit[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("business_units").select("*").order("name")

  if (error) throw error
  return data || []
}

// Get products by BU ID
export async function getProductsByBU(buId: string): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("products").select("*").eq("business_unit_id", buId).order("name")

  if (error) throw error
  return data || []
}

// Get all roles
export async function getRoles(): Promise<Role[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("roles").select("*").order("name")

  if (error) throw error
  return data || []
}

// Get current user profile
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] Getting profile for user:", user?.id)

  if (!user) return null

  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  console.log("[v0] Profile query result:", { data, error })

  if (error && error.code !== "PGRST116") throw error // PGRST116 = no rows found
  return data
}

// Get user profile roles
export async function getUserProfileRoles(profileId: string): Promise<Role[]> {
  const supabase = createClient()

  const { data: profileRoles, error: prError } = await supabase
    .from("user_profile_roles")
    .select("role_id")
    .eq("user_profile_id", profileId)

  if (prError) throw prError
  if (!profileRoles?.length) return []

  const roleIds = profileRoles.map((pr) => pr.role_id)

  const { data: roles, error: rolesError } = await supabase.from("roles").select("*").in("id", roleIds)

  if (rolesError) throw rolesError
  return roles || []
}

// Create user profile during onboarding
export async function createUserProfile(
  buId: string | null,
  productId: string | null,
  roleIds: string[],
  fullName: string,
  email: string,
): Promise<UserProfile> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] Creating profile for user:", user?.id, { buId, roleIds, fullName, email })

  if (!user) throw new Error("Not authenticated")

  // Create the profile
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .insert({
      id: user.id,
      email: email,
      full_name: fullName,
      business_unit_id: buId, // Can be null for Platform Governance
      onboarded: true,
    })
    .select()
    .single()

  console.log("[v0] Profile created:", { profile, profileError })

  if (profileError) throw profileError

  // Add roles
  if (roleIds.length > 0) {
    const roleInserts = roleIds.map((roleId) => ({
      user_profile_id: profile.id,
      role_id: roleId,
    }))

    console.log("[v0] Inserting roles:", roleInserts)

    const { error: rolesError } = await supabase.from("user_profile_roles").insert(roleInserts)

    console.log("[v0] Roles inserted:", { rolesError })

    if (rolesError) throw rolesError
  }

  console.log("[v0] Profile creation complete")

  return profile
}

// Get BU by ID
export async function getBUById(buId: string): Promise<BusinessUnit | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("business_units").select("*").eq("id", buId).single()

  if (error) return null
  return data
}

// Get product by ID
export async function getProductById(productId: string): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", productId).single()

  if (error) return null
  return data
}
