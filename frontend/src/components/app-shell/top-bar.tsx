"use client"

import { CiscoLogo } from "@/components/cisco-logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronDown, LogOut, Settings, User, Menu } from "lucide-react"
import type { BusinessUnit, Role } from "@/lib/types"
import { GlobalSearch } from "@/components/global-search"

interface TopBarProps {
  user: { id: string; email: string; full_name: string } | null
  businessUnit: BusinessUnit | null
  roles: Role[]
  onMenuToggle?: () => void
  showMenuButton?: boolean
  onSignOut: () => void
}

export function TopBar({ user, businessUnit, roles, onMenuToggle, showMenuButton = false, onSignOut }: TopBarProps) {
  const initials =
    user?.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  const isPlatformGovernance = roles.some((r) => r.key === "platform_governance")

  return (
    <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden text-foreground">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-3">
          <CiscoLogo className="h-7 w-auto text-foreground" />
          <span className="text-base font-semibold text-foreground hidden sm:block">MCP Integration Platform</span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-4">
        {/* Active Context Display */}
        <div className="hidden md:flex items-center gap-2">
          {businessUnit && (
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground border-0">
              {businessUnit.name}
            </Badge>
          )}
        </div>

        {/* Role Badges */}
        <div className="hidden lg:flex items-center gap-1.5">
          {roles.slice(0, 2).map((role) => (
            <Badge
              key={role.id}
              variant="outline"
              className={`text-xs ${
                role.key === "platform_governance"
                  ? "border-foreground/50 text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {role.key === "platform_governance" ? "Governance" : role.name.replace("MCP ", "")}
            </Badge>
          ))}
          {roles.length > 2 && (
            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
              +{roles.length - 2}
            </Badge>
          )}
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 h-9 px-2 text-foreground hover:bg-secondary">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-secondary text-foreground text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm text-foreground">{user?.full_name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border">
            <DropdownMenuLabel className="text-foreground">
              <div className="flex flex-col">
                <span>{user?.full_name}</span>
                <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <div className="px-2 py-1.5 md:hidden">
              <p className="text-xs text-muted-foreground mb-1">Business Unit</p>
              <p className="text-sm text-foreground">{businessUnit?.name}</p>
            </div>
            <DropdownMenuSeparator className="bg-border md:hidden" />
            <DropdownMenuItem className="cursor-pointer text-foreground focus:bg-secondary">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            {isPlatformGovernance && (
              <DropdownMenuItem className="cursor-pointer text-foreground focus:bg-secondary">
                <Settings className="mr-2 h-4 w-4" />
                Platform Settings
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10" onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
