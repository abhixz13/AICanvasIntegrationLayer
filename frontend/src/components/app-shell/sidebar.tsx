"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Server,
  Sparkles,
  Briefcase,
  CheckSquare,
  BarChart3,
  BookOpen,
  Settings,
  ChevronRight,
  X,
} from "lucide-react"
import type { BusinessUnit, Role } from "@/lib/types"

interface SidebarProps {
  businessUnit: BusinessUnit | null
  roles: Role[]
  isOpen?: boolean
  onClose?: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  requiresGovernance?: boolean
  disabled?: boolean
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "MCP Servers",
    href: "/dashboard/mcp-servers",
    icon: <Server className="h-4 w-4" />,
    children: [
      {
        label: "Catalogue",
        href: "/dashboard/mcp-servers?tab=catalogue",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        label: "Manage",
        href: "/dashboard/mcp-servers?tab=manage",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Skills",
    href: "/skills",
    icon: <Sparkles className="h-4 w-4" />,
    children: [
      {
        label: "Catalogue",
        href: "/skills",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        label: "Manage",
        href: "/skills/manage",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Use Cases",
    href: "/dashboard/use-cases",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    label: "Approvals",
    href: "/dashboard/approvals",
    icon: <CheckSquare className="h-4 w-4" />,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    label: "Docs & SDKs",
    href: "/dashboard/docs",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-4 w-4" />,
    requiresGovernance: true,
  },
]

export function Sidebar({ businessUnit, roles, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isPlatformGovernance = roles.some((r) => r.name === "platform_governance")

  const filteredNavItems = navItems.filter((item) => {
    if (item.requiresGovernance && !isPlatformGovernance) {
      return false
    }
    return true
  })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border",
          "flex flex-col transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-sidebar-border">
          <span className="font-semibold text-sidebar-foreground">Navigation</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-1">
            {filteredNavItems.map((item) => {
              const isParentActive = pathname === item.href || (item.children && pathname.startsWith(item.href))
              const currentTab = searchParams.get("tab")

              return (
                <div key={item.href}>
                  {!item.children ? (
                    <Link
                      href={item.disabled ? "#" : item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                        "group",
                        isParentActive
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        item.disabled && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <span
                        className={cn(
                          isParentActive
                            ? "text-sidebar-foreground"
                            : "text-muted-foreground group-hover:text-sidebar-foreground",
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {isParentActive && <ChevronRight className="h-4 w-4 text-sidebar-foreground" />}
                    </Link>
                  ) : (
                    <div className="space-y-1">
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground",
                        )}
                      >
                        <span>{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                      </div>
                      <div className="pl-9 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive =
                            pathname === child.href.split("?")[0] &&
                            (child.href.includes("?tab=")
                              ? currentTab === child.href.split("?tab=")[1]
                              : true)

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isChildActive
                                  ? "bg-sidebar-accent text-sidebar-foreground"
                                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                              )}
                            >
                              {child.label}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground">MCP Platform v1.0</p>
        </div>
      </aside>
    </>
  )
}
