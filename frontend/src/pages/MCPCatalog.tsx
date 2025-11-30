
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText, Plus, Search, ChevronDown, Server, CheckCircle, Clock, Archive } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function MCPCatalog() {
  const navigate = useNavigate();

  const { data: mcpServers = [], isLoading } = useQuery({
    queryKey: ["mcp-servers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mcp_servers")
        .select("*, business_use_cases(title)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const statusCounts = {
    draft: mcpServers.filter(s => s.lifecycle_state === "draft").length,
    in_review: mcpServers.filter(s => s.lifecycle_state === "in_review").length,
    approved: mcpServers.filter(s => s.lifecycle_state === "approved").length,
    deprecated: mcpServers.filter(s => s.lifecycle_state === "deprecated").length,
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">MCP Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Manage and register Model Context Protocol servers
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              New MCP Server
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem onClick={() => navigate("/register/wizard")}>
              <Server className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium">Register Existing MCP Server</div>
                <div className="text-xs text-muted-foreground">
                  Already built your MCP
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/register/guided")}>
              <FileText className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium">Create & Register (Guided)</div>
                <div className="text-xs text-muted-foreground">
                  Learn and build step-by-step
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.draft}</div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.in_review}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.approved}</div>
            <p className="text-xs text-muted-foreground">Active in registry</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deprecated</CardTitle>
            <Archive className="h-4 w-4 text-error" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.deprecated}</div>
            <p className="text-xs text-muted-foreground">No longer active</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>MCP Servers</CardTitle>
              <CardDescription>All registered MCP servers in your organization</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search servers..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MCP Name</TableHead>
                <TableHead>Lifecycle</TableHead>
                <TableHead>Use Cases</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : mcpServers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                    <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-1">No MCP servers yet</p>
                    <p className="text-sm">Get started by creating your first MCP server</p>
                  </TableCell>
                </TableRow>
              ) : (
                mcpServers.map((server) => (
                  <TableRow key={server.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link to={`/mcp/${server.id}`} className="font-medium hover:text-primary">
                        {server.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={server.lifecycle_state} />
                    </TableCell>
                    <TableCell>
                      {server.business_use_cases ? (
                        <span className="text-sm">{server.business_use_cases.title}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not mapped</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{server.owner_email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(server.updated_at || server.created_at || "").toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
