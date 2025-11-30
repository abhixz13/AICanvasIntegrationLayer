"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Server, Search, ChevronDown, MoreHorizontal, Edit, Trash, Send, Ban, Eye, AlertTriangle, Link as LinkIcon, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CreateMcpWizard } from "@/components/mcp/create-mcp-wizard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useActiveProfile } from "@/lib/hooks/use-active-profile"
import { fetchMcpServers, type McpServer } from "@/lib/api-mcp-servers"
import { fetchUseCases, type BusinessUseCase } from "@/lib/api-use-cases"
import { getBusinessUnits } from "@/lib/api"
import { type BusinessUnit } from "@/lib/types"

export default function McpServersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeProfile = useActiveProfile()
  const [servers, setServers] = useState<McpServer[]>([])
  const [useCases, setUseCases] = useState<BusinessUseCase[]>([])
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const activeTab = searchParams.get("tab") || "manage"

  // New dynamic filter state
  const [filterCategory, setFilterCategory] = useState<string>("bu")
  const [filterValue, setFilterValue] = useState<string>("all")

  const hasPlatformGov = activeProfile?.roleIds?.includes("platform_governance") || false
  const canCreateServer =
    activeProfile?.roleIds?.some((r) =>
      ["publisher", "product_admin", "engineering_admin", "platform_governance"].includes(r),
    ) || false

  const isAdmin =
    activeProfile?.roleIds?.some((r) =>
      ["product_admin", "engineering_admin", "platform_governance"].includes(r),
    ) || false

  const handleRowClick = (serverId: string) => {
    router.push(`/dashboard/mcp-servers/${serverId}`)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [serversData, useCasesData, busData] = await Promise.all([
          fetchMcpServers(undefined),
          fetchUseCases(undefined),
          getBusinessUnits(),
        ])

        console.log(
          "[v0] Loaded servers:",
          serversData.length,
          "use cases:",
          useCasesData.length,
          "BUs:",
          busData.length,
        )
        setServers(serversData)
        setUseCases(useCasesData.filter((uc) => uc.status === "active"))
        setBusinessUnits(busData)
      } catch (error) {
        console.error("[v0] Failed to load data:", error)
        setServers([])
        setUseCases([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, []) // Empty dependency array - load only once on mount

  // Collect all unique tags
  const uniqueTags = Array.from(new Set(servers.flatMap((s) => s.tags))).sort()

  const filteredServers = servers.filter((server) => {
    const matchesSearch =
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      server.owner_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (businessUnits.find((bu) => bu.id === server.bu_id)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false)

    // Dynamic filtering logic
    let matchesFilter = true

    if (filterValue !== "all") {
      switch (filterCategory) {
        case "bu":
          if (filterValue === "my_bu") {
            matchesFilter = server.bu_id === activeProfile?.buId
          } else {
            matchesFilter = server.bu_id === filterValue
          }
          break
        case "use_case":
          matchesFilter = server.business_use_case_id === filterValue
          break
        case "lifecycle":
          matchesFilter = server.lifecycle_state === filterValue
          break
        case "tags":
          matchesFilter = server.tags.includes(filterValue)
          break
      }
    }

    return matchesSearch && matchesFilter
  })

  // Summary Metrics
  const metrics = {
    total: servers.length,
    approved: servers.filter((s) => s.lifecycle_state === "active").length,
    inReview: servers.filter((s) => s.lifecycle_state === "in_review").length,
    draft: servers.filter((s) => s.lifecycle_state === "draft").length,
    deprecated: servers.filter((s) => s.lifecycle_state === "deprecated").length,
  }

  const getLifecycleColor = (state: string) => {
    switch (state) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "in_review":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "draft":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "deprecated":
        return "bg-red-500/10 text-red-400 border-red-500/20 cursor-pointer hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getTestStatusColor = (status: string | null) => {
    switch (status) {
      case "passing":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "failing":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  if (!activeProfile || isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading MCP servers...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Split Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">MCP Servers</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your Model Context Protocol servers.
          </p>
        </div>
        {canCreateServer && (
          <div className="flex items-center">
            <Button onClick={() => router.push("/dashboard/mcp-servers/create")} className="rounded-r-none">
              <Plus className="w-4 h-4 mr-2" />
              New MCP Server
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-l-none border-l border-primary-foreground/20 px-2" variant="default">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/dashboard/mcp-servers/create")}>
                  BYOS and Register
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsWizardOpen(true)}>
                  Create and Register
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Summary Bar */}
      {activeTab === "manage" && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          <Card
            className="p-3 flex flex-col items-center justify-center bg-card border-border shadow-sm cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => {
              setFilterCategory("lifecycle")
              setFilterValue("all")
            }}
          >
            <div className="text-2xl font-bold">{metrics.total}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Servers</div>
          </Card>
          <Card
            className="p-3 flex flex-col items-center justify-center bg-green-500/5 border-green-500/20 shadow-sm cursor-pointer hover:bg-green-500/10 transition-colors"
            onClick={() => {
              setFilterCategory("lifecycle")
              setFilterValue("active")
            }}
          >
            <div className="text-2xl font-bold text-green-500">{metrics.approved}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Approved</div>
          </Card>
          <Card
            className="p-3 flex flex-col items-center justify-center bg-blue-500/5 border-blue-500/20 shadow-sm cursor-pointer hover:bg-blue-500/10 transition-colors"
            onClick={() => {
              setFilterCategory("lifecycle")
              setFilterValue("in_review")
            }}
          >
            <div className="text-2xl font-bold text-blue-500">{metrics.inReview}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">In Review</div>
          </Card>
          <Card
            className="p-3 flex flex-col items-center justify-center bg-yellow-500/5 border-yellow-500/20 shadow-sm cursor-pointer hover:bg-yellow-500/10 transition-colors"
            onClick={() => {
              setFilterCategory("lifecycle")
              setFilterValue("draft")
            }}
          >
            <div className="text-2xl font-bold text-yellow-500">{metrics.draft}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Draft</div>
          </Card>
          <Card
            className="p-3 flex flex-col items-center justify-center bg-orange-500/5 border-orange-500/20 shadow-sm cursor-pointer hover:bg-orange-500/10 transition-colors"
            onClick={() => {
              setFilterCategory("lifecycle")
              setFilterValue("deprecated")
            }}
          >
            <div className="text-2xl font-bold text-orange-500">{metrics.deprecated}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Deprecated</div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      {activeTab === "catalogue" ? (
        <Card className="p-12 text-center bg-card border-border shadow-sm">
          <Server className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">MCP Catalogue</h3>
          <p className="text-muted-foreground">Browse and discover available MCP servers.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Filter Bar */}
          <Card className="p-3 bg-card border-border shadow-sm">
            <div className="flex flex-col md:flex-row gap-2 items-center">

              {/* Filter Category */}
              <div className="w-full md:w-[180px]">
                <Select value={filterCategory} onValueChange={(val) => {
                  setFilterCategory(val)
                  setFilterValue("all") // Reset value when category changes
                }}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Filter by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bu">Business Unit</SelectItem>
                    <SelectItem value="use_case">Use Case</SelectItem>
                    <SelectItem value="lifecycle">Lifecycle</SelectItem>
                    <SelectItem value="tags">Tags</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Value */}
              <div className="w-full md:w-[220px]">
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select option..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>

                    {filterCategory === "bu" && (
                      <>
                        <SelectItem value="my_bu">My BU</SelectItem>
                        {businessUnits.map((bu) => (
                          <SelectItem key={bu.id} value={bu.id}>{bu.name}</SelectItem>
                        ))}
                      </>
                    )}

                    {filterCategory === "use_case" && useCases.map((uc) => (
                      <SelectItem key={uc.id} value={uc.id}>{uc.title}</SelectItem>
                    ))}

                    {filterCategory === "lifecycle" && (
                      <>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="active">Approved</SelectItem>
                        <SelectItem value="deprecated">Deprecated</SelectItem>
                      </>
                    )}

                    {filterCategory === "tags" && uniqueTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, skill, BU, owner, use case..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Inventory Table */}
          {servers.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border shadow-sm">
              <Server className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No MCP servers registered yet</h3>
              <p className="text-muted-foreground mb-4">Get started by registering your first MCP server</p>
              {canCreateServer && (
                <div className="flex items-center justify-center">
                  <Button onClick={() => router.push("/dashboard/mcp-servers/create")} className="rounded-r-none">
                    <Plus className="w-4 h-4 mr-2" />
                    New MCP Server
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="rounded-l-none border-l border-primary-foreground/20 px-2" variant="default">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push("/dashboard/mcp-servers/create")}>
                        BYOL and Register MCP Server
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsWizardOpen(true)}>
                        Create & Register MCP Server (Future)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </Card>
          ) : filteredServers.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border shadow-sm">
              <Server className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No MCP servers match your filters</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setFilterValue("all")
                }}
              >
                Reset filters
              </Button>
            </Card>
          ) : (
            <Card className="bg-card border-border shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="text-left text-sm text-muted-foreground hover:bg-transparent">
                      <TableHead className="p-3 text-base font-semibold text-foreground">MCP Name</TableHead>
                      <TableHead className="p-3 text-base font-semibold text-foreground">BU</TableHead>
                      <TableHead className="p-3 text-base font-semibold text-foreground">Use Cases</TableHead>
                      <TableHead className="p-3 text-base font-semibold text-foreground">Owner Team</TableHead>
                      <TableHead className="p-3 text-base font-semibold text-foreground">Lifecycle</TableHead>
                      <TableHead className="p-3 text-base font-semibold text-foreground">Skills</TableHead>
                      <TableHead className="p-3 text-base font-semibold text-foreground">Risk</TableHead>
                      <TableHead className="p-3 text-base font-semibold text-foreground">Tags</TableHead>
                      <TableHead className="p-3 text-base font-semibold text-foreground">Updated</TableHead>
                      <TableHead className="p-3 text-base font-semibold text-foreground w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border">
                    {filteredServers.map((server) => (
                      <TableRow
                        key={server.id}
                        className="hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(server.id)}
                      >
                        <TableCell className="p-3">
                          <Link
                            href={`/dashboard/mcp-servers/${server.id}`}
                            className="font-medium hover:underline text-foreground flex items-center gap-2"
                          >
                            {server.name}
                          </Link>
                        </TableCell>
                        <TableCell className="p-3 text-sm text-muted-foreground">
                          {businessUnits.find((bu) => bu.id === server.bu_id)?.name || "Unknown BU"}
                        </TableCell>
                        <TableCell className="p-3 text-sm text-muted-foreground">
                          {(() => {
                            const useCase = useCases.find((uc) => uc.id === server.business_use_case_id)
                            if (useCase) {
                              return (
                                <Badge variant="secondary" className="font-normal">
                                  {useCase.title}
                                </Badge>
                              )
                            }
                            // Mock data for Approved servers if missing
                            if (server.lifecycle_state === "active") {
                              return (
                                <Badge variant="secondary" className="font-normal">
                                  {`Use Case for ${server.name.split(" ")[0]}`}
                                </Badge>
                              )
                            }
                            return <span className="text-muted-foreground/50">N/A</span>
                          })()}
                        </TableCell>
                        <TableCell className="p-3 text-sm text-muted-foreground">{server.owner_email}</TableCell>
                        <TableCell className="p-3">
                          {server.lifecycle_state === "deprecated" ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 cursor-pointer hover:bg-red-500/20">
                                    Deprecated
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{server.deprecation_reason || "No reason provided"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <Badge
                              variant="outline"
                              className={
                                server.lifecycle_state === "active"
                                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                                  : server.lifecycle_state === "in_review"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    : server.lifecycle_state === "draft"
                                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                      : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                              }
                            >
                              {server.lifecycle_state === "active"
                                ? "Approved"
                                : server.lifecycle_state === "in_review"
                                  ? "In Review"
                                  : server.lifecycle_state.charAt(0).toUpperCase() + server.lifecycle_state.slice(1)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="p-3 text-sm font-mono text-muted-foreground">
                          {(() => {
                            // Mock skills data based on server ID hash
                            const hash = server.id.charCodeAt(0)
                            const total = (hash % 15) + 5
                            const read = Math.floor(total * 0.4)
                            const write = Math.floor(total * 0.3)
                            const auto = total - read - write
                            return `${total} (${read}R / ${write}W / ${auto}A)`
                          })()}
                        </TableCell>
                        <TableCell className="p-3">
                          {(() => {
                            // Mock risk based on server ID hash
                            const hash = server.id.charCodeAt(1)
                            const riskLevel = hash % 3 // 0=Low, 1=Medium, 2=High
                            if (riskLevel === 0) {
                              return (
                                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                                  Low
                                </Badge>
                              )
                            } else if (riskLevel === 1) {
                              return (
                                <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                                  Medium
                                </Badge>
                              )
                            } else {
                              return (
                                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                                  High
                                </Badge>
                              )
                            }
                          })()}
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {server.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {server.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{server.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-3 text-sm text-muted-foreground">
                          {new Date(server.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="p-3" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/mcp-servers/${server.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </DropdownMenuItem>

                              {server.lifecycle_state === "draft" && (
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/mcp-servers/${server.id}/edit`)}>
                                  <LinkIcon className="mr-2 h-4 w-4" />
                                  Attach Use Case...
                                </DropdownMenuItem>
                              )}

                              {server.lifecycle_state === "draft" && server.business_use_case_id && (
                                <DropdownMenuItem>
                                  <Send className="mr-2 h-4 w-4" />
                                  Submit for Production Review
                                </DropdownMenuItem>
                              )}

                              {server.lifecycle_state === "in_review" && hasPlatformGov && (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve MCP
                                </DropdownMenuItem>
                              )}

                              {server.lifecycle_state === "active" && (
                                <DropdownMenuItem className="text-orange-600">
                                  <Ban className="mr-2 h-4 w-4" />
                                  Deprecate MCP
                                </DropdownMenuItem>
                              )}

                              {isAdmin && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>
      )
      }

      <CreateMcpWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialFlow="build"
      />
    </div >
  )
}
