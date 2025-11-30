import { Home, Server, CheckSquare, Settings, Zap, ChevronRight } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navItems = [
  { title: "MCP Catalog", url: "/", icon: Home },
  { title: "My MCP Servers", url: "/my-servers", icon: Server },
  { title: "Approvals", url: "/approvals", icon: CheckSquare },
  { title: "Settings", url: "/settings", icon: Settings },
];

const skillsSubItems = [
  { title: "Skill Catalogue", url: "/skills" },
  { title: "Manage", url: "/skills/manage" },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const [skillsOpen, setSkillsOpen] = useState(false);

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Server className="h-5 w-5 text-primary-foreground" />
            </div>
            {open && (
              <div>
                <h2 className="text-sm font-semibold">MCP Registry</h2>
                <p className="text-xs text-muted-foreground">Enterprise Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3"
                      activeClassName="bg-accent text-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <Collapsible open={skillsOpen} onOpenChange={setSkillsOpen} asChild>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center gap-3">
                      <Zap className="h-4 w-4" />
                      <span>Skills</span>
                      <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${skillsOpen ? 'rotate-90' : ''}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {skillsSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to={subItem.url}
                              end
                              className="flex items-center"
                              activeClassName="bg-accent text-accent-foreground font-medium"
                            >
                              <span>{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
