"use client"

import type React from "react"
import { useState } from "react"
import { TopBar } from "./top-bar"
import { Sidebar } from "./sidebar"
import { Loader2 } from "lucide-react"
import { useUserContext } from "@/lib/hooks/use-user-context"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { user, businessUnit, roles, isLoading, signOut } = useUserContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar
        user={user}
        businessUnit={businessUnit}
        roles={roles}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton
        onSignOut={signOut}
      />
      <div className="flex-1 flex">
        <Sidebar businessUnit={businessUnit} roles={roles} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
