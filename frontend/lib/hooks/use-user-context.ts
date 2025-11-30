"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getBUById, getUserProfileRoles } from "@/lib/api"
import type { UserProfile, BusinessUnit, Role } from "@/lib/types"

interface UserContext {
  user: { id: string; email: string; full_name: string } | null
  profile: UserProfile | null
  businessUnit: BusinessUnit | null
  roles: Role[]
  isLoading: boolean
  signOut: () => Promise<void>
}

export function useUserContext(): UserContext {
  const [user, setUser] = useState<{ id: string; email: string; full_name: string } | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUserContext() {
      const supabase = createClient()

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        // MOCK FOR DEV
        console.log("Using mock profile for dev")
        setUser({ id: "mock-user", email: "dev@example.com", full_name: "Dev User" })
        setProfile({
          id: "mock-profile",
          email: "dev@example.com",
          full_name: "Dev User",
          business_unit_id: "bu-1",
          onboarded: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        setBusinessUnit({
          id: "bu-1",
          name: "Engineering",
          description: "Engineering BU",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        setRoles([
          {
            id: "role-1",
            name: "product_admin",
            description: "Admin",
            created_at: new Date().toISOString(),
          },
        ])
        setIsLoading(false)
        return
      }

      setUser({
        id: authUser.id,
        email: authUser.email || "",
        full_name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
      })

      const { data: profileData } = await supabase.from("user_profiles").select("*").eq("id", authUser.id).single()

      if (profileData) {
        setProfile(profileData)

        if (profileData.business_unit_id) {
          const bu = await getBUById(profileData.business_unit_id)
          setBusinessUnit(bu)
        }

        // Get roles
        const userRoles = await getUserProfileRoles(profileData.id)
        setRoles(userRoles)
      }

      setIsLoading(false)
    }

    loadUserContext()
  }, [])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  return {
    user,
    profile,
    businessUnit,
    roles,
    isLoading,
    signOut,
  }
}
