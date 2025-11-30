import type React from "react"
import { AppShell } from "@/components/app-shell/app-shell"

export default function MCPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
