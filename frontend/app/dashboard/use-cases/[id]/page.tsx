"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useActiveProfile } from "@/lib/hooks/use-active-profile"
import { useUseCases } from "@/lib/contexts/use-case-context"
import type { BusinessUseCase } from "@/lib/mock/mockUseCaseData"
import { fetchMcpServers, type McpServer } from "@/lib/api-mcp-servers"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApprovalWorkflowTimeline } from "@/components/approval-workflow-timeline"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Server,
  Sparkles,
  Tag,
  Calendar,
  User,
  CheckSquare,
  Building2,
  Clock,
  Plus,
  MoreHorizontal,
} from "lucide-react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function UseCaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const activeProfile = useActiveProfile()
  const { getUseCaseById, updateUseCase, approveUseCase, rejectUseCase } = useUseCases()
  const [useCase, setUseCase] = useState<BusinessUseCase | null>(null)
  const [mcpServers, setMcpServers] = useState<McpServer[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<Partial<BusinessUseCase>>({})
  const [approvalComment, setApprovalComment] = useState("")
  const [showApprovalDialog, setShowApprovalDialog] = useState<"approve" | "reject" | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const [showAttachMcpModal, setShowAttachMcpModal] = useState(false)
  const [showAttachSkillModal, setShowAttachSkillModal] = useState(false)
  const [availableMcpServers, setAvailableMcpServers] = useState<any[]>([])
  const [availableSkills, setAvailableSkills] = useState<any[]>([])
  const [selectedMcpServers, setSelectedMcpServers] = useState<Set<string>>(new Set())
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set())
  const [mcpSearchQuery, setMcpSearchQuery] = useState("")
  const [mcpBuFilter, setMcpBuFilter] = useState("all")
  const [mcpLifecycleFilter, setMcpLifecycleFilter] = useState("all")
  const [skillSearchQuery, setSkillSearchQuery] = useState("")
  const [skillBuFilter, setSkillBuFilter] = useState("all")
  const [skillLifecycleFilter, setSkillLifecycleFilter] = useState("all")

  const isPlatformGovernance = activeProfile?.roleIds.includes("platform_governance") || false
  const isProductAdmin = activeProfile?.roleIds.includes("product_admin") || false
  const canApprove = isPlatformGovernance || isProductAdmin
  const canEdit = activeProfile?.roleIds.includes("product_admin") || false

  const getLifecycleLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Approved"
      case "draft":
        return "Draft"
      case "pending_product_admin":
      case "pending_platform_admin":
        return "In Review"
      case "archived":
        return "Deprecated"
      default:
        return status
    }
  }

  const getLifecycleBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "pending_product_admin":
      case "pending_platform_admin":
        return "outline"
      case "archived":
        return "destructive"
      default:
        return "outline"
    }
  }

  useEffect(() => {
    const uc = getUseCaseById(params.id as string)
    if (uc) {
      setUseCase(uc)
      setEditedData(uc)
      loadMcpServers(uc.id)
    }
  }, [params.id, getUseCaseById])

  const loadMcpServers = async (useCaseId: string) => {
    try {
      const servers = await fetchMcpServers()
      const filtered = servers.filter((s) => s.business_use_case_id === useCaseId)
      setMcpServers(filtered)
    } catch (error) {
      console.error("[v0] Failed to load MCP servers:", error)
    }
  }

  useEffect(() => {
    if (showAttachMcpModal) {
      loadAvailableMcpServers()
    }
  }, [showAttachMcpModal])

  useEffect(() => {
    if (showAttachSkillModal) {
      loadAvailableSkills()
    }
  }, [showAttachSkillModal])

  const loadAvailableMcpServers = async () => {
    try {
      const response = await fetch("/api/mcp-servers")
      if (response.ok) {
        const servers = await response.json()
        setAvailableMcpServers(servers)
      }
    } catch (error) {
      console.error("[v0] Error loading MCP servers:", error)
    }
  }

  const loadAvailableSkills = async () => {
    // Mock skills data - replace with actual API call
    setAvailableSkills([
      { id: "1", name: "run_trace", mcpServer: "meraki_mcp", bu: "AI Platform", lifecycle: "active", status: "Active" },
      {
        id: "2",
        name: "get_network_clients",
        mcpServer: "meraki_mcp",
        bu: "AI Platform",
        lifecycle: "active",
        status: "Active",
      },
      {
        id: "3",
        name: "analyze_traffic",
        mcpServer: "te_telemetry_mcp",
        bu: "ThousandEyes",
        lifecycle: "active",
        status: "Active",
      },
      {
        id: "4",
        name: "get_alerts",
        mcpServer: "te_telemetry_mcp",
        bu: "ThousandEyes",
        lifecycle: "deprecated",
        status: "Inactive",
      },
    ])
  }

  const handleSave = () => {
    updateUseCase(useCase.id, editedData)
    setIsEditing(false)
    const updated = { ...useCase, ...editedData } as BusinessUseCase
    setUseCase(updated)
  }

  const handleApprove = () => {
    const role = useCase.status === "pending_product_admin" ? "product_admin" : "platform_admin"
    approveUseCase(useCase.id, "current-user@cisco.com", role, approvalComment)
    setShowApprovalDialog(null)
    setApprovalComment("")
    router.push("/dashboard/use-cases")
  }

  const handleReject = () => {
    const role = useCase.status === "pending_product_admin" ? "product_admin" : "platform_admin"
    rejectUseCase(useCase.id, "current-user@cisco.com", role, approvalComment)
    setShowApprovalDialog(null)
    setApprovalComment("")
    router.push("/dashboard/use-cases")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedData(useCase)
  }

  const handleAttachMcpServers = async () => {
    // TODO: Implement attach logic with API call
    console.log("[v0] Attaching MCP servers:", Array.from(selectedMcpServers))
    setShowAttachMcpModal(false)
    setSelectedMcpServers(new Set())
  }

  const handleAttachSkills = async () => {
    // TODO: Implement attach logic with API call
    console.log("[v0] Attaching skills:", Array.from(selectedSkills))
    setShowAttachSkillModal(false)
    setSelectedSkills(new Set())
  }

  const showWorkflow = useCase?.status !== "active" && useCase?.status !== "rejected"

  const filteredMcpServers = availableMcpServers.filter((server) => {
    const matchesSearch = server.name.toLowerCase().includes(mcpSearchQuery.toLowerCase())
    const matchesBu = mcpBuFilter === "all" || server.bu_id === mcpBuFilter
    const matchesLifecycle = mcpLifecycleFilter === "all" || server.lifecycle_state === mcpLifecycleFilter
    // Only show approved or active servers
    const isValid = server.lifecycle_state === "active" || server.lifecycle_state === "draft"
    return matchesSearch && matchesBu && matchesLifecycle && isValid
  })

  const filteredSkills = availableSkills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
    const matchesBu = skillBuFilter === "all" || skill.bu === skillBuFilter
    const matchesLifecycle = skillLifecycleFilter === "all" || skill.lifecycle === skillLifecycleFilter
    return matchesSearch && matchesBu && matchesLifecycle
  })

  if (!useCase) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading use case...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-4">
        <Link href="/dashboard/use-cases">
          <Button variant="ghost" className="gap-2 -ml-2 h-8 text-xs">
            <ArrowLeft className="h-3 w-3" />
            Back to Use Cases
          </Button>
        </Link>

        {/* Title and Actions Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editedData.title || ""}
                onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                className="text-2xl font-bold h-auto py-2 px-3 border-2"
                placeholder="Use case title"
              />
            ) : (
              <h1 className="text-2xl font-bold text-foreground">{useCase.title}</h1>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {canApprove && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApprovalDialog("reject")}
                  className="gap-2 h-8 text-xs"
                >
                  <X className="h-3 w-3" />
                  Reject
                </Button>
                <Button size="sm" onClick={() => setShowApprovalDialog("approve")} className="gap-2 h-8 text-xs">
                  <CheckSquare className="h-3 w-3" />
                  Approve
                </Button>
              </>
            )}

            {canEdit && !canApprove && (
              <>
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="gap-2 h-8 text-xs bg-transparent"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} className="gap-2 h-8 text-xs">
                      <Save className="h-3 w-3" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)} className="gap-2 h-8 text-xs">
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-4 flex-wrap text-xs">
          {/* Lifecycle */}
          <Badge variant={getLifecycleBadgeVariant(useCase.status)} className="text-xs">
            {getLifecycleLabel(useCase.status)}
          </Badge>

          {/* Owning BU */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            <span>{useCase.buName}</span>
          </div>

          {/* Domain Tags */}
          {useCase.tags && useCase.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex gap-1.5">
                {useCase.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
                {useCase.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    +{useCase.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {new Date(useCase.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Short Description */}
        {isEditing ? (
          <Textarea
            value={editedData.description || ""}
            onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
            className="min-h-20 border-2 text-xs"
            placeholder="Use case description"
          />
        ) : (
          <p className="text-xs text-muted-foreground leading-relaxed">{useCase.description}</p>
        )}
      </div>

      {showApprovalDialog && (
        <Card className="p-4 border-2 border-primary">
          <h3 className="text-base font-semibold mb-3">
            {showApprovalDialog === "approve" ? "Approve Use Case" : "Reject Use Case"}
          </h3>
          <Textarea
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.target.value)}
            placeholder="Add comments (optional)"
            className="mb-3 text-xs"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={showApprovalDialog === "approve" ? "default" : "destructive"}
              onClick={showApprovalDialog === "approve" ? handleApprove : handleReject}
              className="h-8 text-xs"
            >
              Confirm {showApprovalDialog === "approve" ? "Approval" : "Rejection"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowApprovalDialog(null)} className="h-8 text-xs">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-secondary/50">
          <TabsTrigger value="overview" className="text-xs px-3 py-1.5">
            Overview
          </TabsTrigger>
          <TabsTrigger value="problem-statement" className="text-xs px-3 py-1.5">
            Problem Statement
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="text-xs px-3 py-1.5">
            Outcomes
          </TabsTrigger>
          <TabsTrigger value="domain" className="text-xs px-3 py-1.5">
            Domain
          </TabsTrigger>
          <TabsTrigger value="mcp-servers" className="text-xs px-3 py-1.5">
            MCP Servers
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-xs px-3 py-1.5">
            Skills
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {showWorkflow && (
              <div className="lg:col-span-3">
                <ApprovalWorkflowTimeline useCase={useCase} />
              </div>
            )}

            {/* Metadata */}
            <Card className="p-4 space-y-3 h-fit lg:col-span-1">
              <h2 className="text-base font-semibold text-foreground">Details</h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>Owner: {useCase.owner}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Created: {new Date(useCase.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="border-t border-border pt-2.5 mt-2.5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Server className="h-3.5 w-3.5" />
                    <span>{useCase.mcpServerCount} MCP Servers</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{useCase.skillCount} Skills</span>
                </div>
              </div>
            </Card>

            {/* Quick Summary */}
            <Card className="p-4 space-y-3 lg:col-span-2">
              <h2 className="text-base font-semibold text-foreground">Summary</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{useCase.description}</p>
            </Card>
          </div>
        </TabsContent>

        {/* Problem Statement Tab */}
        <TabsContent value="problem-statement" className="mt-4">
          <Card className="p-4 space-y-3">
            <h2 className="text-base font-semibold text-foreground">Problem Statement</h2>
            {isEditing ? (
              <Textarea
                value={editedData.description || ""}
                onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                className="min-h-32 text-xs"
                placeholder="Describe the problem this use case addresses"
              />
            ) : (
              <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>{useCase.description}</p>
                <p className="text-[11px] italic">
                  This use case addresses business challenges by leveraging AI-powered automation.
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Outcomes Tab */}
        <TabsContent value="outcomes" className="mt-4">
          <Card className="p-4 space-y-3">
            <h2 className="text-base font-semibold text-foreground">Expected Outcomes</h2>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-secondary/50">
                <h4 className="font-medium mb-1">Business Impact</h4>
                <p className="text-muted-foreground text-[11px]">
                  Reduce manual effort by 40% and improve response time by 60%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <h4 className="font-medium mb-1">User Experience</h4>
                <p className="text-muted-foreground text-[11px]">
                  Provide faster, more accurate responses to user queries
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <h4 className="font-medium mb-1">Technical Excellence</h4>
                <p className="text-muted-foreground text-[11px]">Demonstrate scalable AI integration patterns</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Domain Tab */}
        <TabsContent value="domain" className="mt-4">
          <Card className="p-4 space-y-3">
            <h2 className="text-base font-semibold text-foreground">Domain & Tags</h2>
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-medium mb-2">Business Unit</h4>
                <Badge variant="outline" className="text-xs">
                  {useCase.buName}
                </Badge>
              </div>
              {useCase.tags && useCase.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {useCase.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* MCP Servers Tab */}
        <TabsContent value="mcp-servers" className="mt-4 space-y-4">
          <Card>
            {/* Header with Attach MCP Server button */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-base font-semibold text-foreground">MCP Servers</h2>
                <Badge variant="secondary" className="text-xs">
                  {mcpServers.length}
                </Badge>
              </div>
              <Button size="sm" className="gap-2 h-8 text-xs" onClick={() => setShowAttachMcpModal(true)}>
                <Server className="h-3 w-3" />
                Attach MCP Server
              </Button>
            </div>

            {/* Table view */}
            {mcpServers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Server className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No MCP servers attached to this use case yet</p>
                <p className="text-[11px] mt-1">Click "Attach MCP Server" to get started</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-secondary/50">
                    <tr className="border-b border-border">
                      <th className="text-left px-3 py-2 font-semibold">Name</th>
                      <th className="text-left px-3 py-2 font-semibold">BU</th>
                      <th className="text-left px-3 py-2 font-semibold">Lifecycle</th>
                      <th className="text-left px-3 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mcpServers.map((server) => (
                      <tr key={server.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="px-3 py-2.5">
                          <Link
                            href={`/dashboard/mcp-servers/${server.id}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {server.name}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{useCase.buName}</td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant={
                              server.lifecycle_state === "active"
                                ? "default"
                                : server.lifecycle_state === "deprecated"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {server.lifecycle_state}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              server.lifecycle_state === "active"
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                            }`}
                          >
                            {server.lifecycle_state === "active" ? "Operational" : "Inactive"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-base font-semibold">Skills</h3>
                <Badge variant="secondary" className="text-xs">
                  {useCase.skillCount || 0}
                </Badge>
              </div>
              <Button
                size="sm"
                className="h-7 text-xs bg-primary hover:bg-primary/90"
                onClick={() => setShowAttachSkillModal(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Attach Skill
              </Button>
            </CardHeader>

            <CardContent className="px-4 pb-4">
              {useCase.skillCount && useCase.skillCount > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead className="text-xs font-medium">Skill Name</TableHead>
                      <TableHead className="text-xs font-medium">MCP Server</TableHead>
                      <TableHead className="text-xs font-medium">Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Mock skills data */}
                    <TableRow className="text-xs">
                      <TableCell>
                        <button className="text-primary hover:underline font-medium text-left">run_trace</button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">meraki_mcp</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem className="text-xs">View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">Detach</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow className="text-xs">
                      <TableCell>
                        <button className="text-primary hover:underline font-medium text-left">
                          get_network_clients
                        </button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">meraki_mcp</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem className="text-xs">View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">Detach</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-xs mb-1 font-medium">No skills attached yet</p>
                  <p className="text-xs opacity-75">Click "Attach Skill" to add skills to this use case</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attach MCP Server Modal */}
      <Dialog open={showAttachMcpModal} onOpenChange={setShowAttachMcpModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg">Attach MCP Server</DialogTitle>
            <DialogDescription className="text-xs">
              Select MCP servers to attach to this use case. Only approved or in-review servers can be linked.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
            {/* Search bar */}
            <Input
              placeholder="Search MCP servers..."
              value={mcpSearchQuery}
              onChange={(e) => setMcpSearchQuery(e.target.value)}
              className="h-9 text-xs"
            />

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={mcpBuFilter} onValueChange={setMcpBuFilter}>
                <SelectTrigger className="h-8 text-xs w-[160px]">
                  <SelectValue placeholder="All BUs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    All BUs
                  </SelectItem>
                  <SelectItem value="ai-platform" className="text-xs">
                    AI Platform
                  </SelectItem>
                  <SelectItem value="thousandeyes" className="text-xs">
                    ThousandEyes
                  </SelectItem>
                  <SelectItem value="meraki" className="text-xs">
                    Meraki
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={mcpLifecycleFilter} onValueChange={setMcpLifecycleFilter}>
                <SelectTrigger className="h-8 text-xs w-[160px]">
                  <SelectValue placeholder="All Lifecycles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    All Lifecycles
                  </SelectItem>
                  <SelectItem value="active" className="text-xs">
                    Active
                  </SelectItem>
                  <SelectItem value="draft" className="text-xs">
                    In Review
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* List with checkboxes */}
            <div className="flex-1 overflow-y-auto border rounded-lg">
              {filteredMcpServers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No MCP servers found</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-secondary/50 sticky top-0">
                    <tr className="border-b border-border">
                      <th className="w-10 px-3 py-2"></th>
                      <th className="text-left px-3 py-2 font-semibold">Name</th>
                      <th className="text-left px-3 py-2 font-semibold">BU</th>
                      <th className="text-left px-3 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMcpServers.map((server) => {
                      const isDisabled = server.lifecycle_state !== "active" && server.lifecycle_state !== "draft"
                      return (
                        <tr
                          key={server.id}
                          className={`border-b border-border ${isDisabled ? "opacity-50" : "hover:bg-secondary/30"}`}
                        >
                          <td className="px-3 py-2.5">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Checkbox
                                      checked={selectedMcpServers.has(server.id)}
                                      onCheckedChange={(checked) => {
                                        const newSelected = new Set(selectedMcpServers)
                                        if (checked) {
                                          newSelected.add(server.id)
                                        } else {
                                          newSelected.delete(server.id)
                                        }
                                        setSelectedMcpServers(newSelected)
                                      }}
                                      disabled={isDisabled}
                                    />
                                  </div>
                                </TooltipTrigger>
                                {isDisabled && (
                                  <TooltipContent className="text-xs">
                                    <p>Only approved or in-review MCP servers can be linked.</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                          <td className="px-3 py-2.5 font-medium">{server.name}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{server.bu_id}</td>
                          <td className="px-3 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                server.lifecycle_state === "active"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {server.lifecycle_state === "active" ? "Active" : "In Review"}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
              onClick={() => setShowAttachMcpModal(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs bg-primary hover:bg-primary/90"
              onClick={handleAttachMcpServers}
              disabled={selectedMcpServers.size === 0}
            >
              Attach {selectedMcpServers.size > 0 && `(${selectedMcpServers.size})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attach Skill Modal */}
      <Dialog open={showAttachSkillModal} onOpenChange={setShowAttachSkillModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg">Attach Skill</DialogTitle>
            <DialogDescription className="text-xs">
              Select skills to attach to this use case. Skills must belong to an approved or in-review MCP server.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
            {/* Search bar */}
            <Input
              placeholder="Search skills..."
              value={skillSearchQuery}
              onChange={(e) => setSkillSearchQuery(e.target.value)}
              className="h-9 text-xs"
            />

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={skillBuFilter} onValueChange={setSkillBuFilter}>
                <SelectTrigger className="h-8 text-xs w-[160px]">
                  <SelectValue placeholder="All BUs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    All BUs
                  </SelectItem>
                  <SelectItem value="AI Platform" className="text-xs">
                    AI Platform
                  </SelectItem>
                  <SelectItem value="ThousandEyes" className="text-xs">
                    ThousandEyes
                  </SelectItem>
                  <SelectItem value="Meraki" className="text-xs">
                    Meraki
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={skillLifecycleFilter} onValueChange={setSkillLifecycleFilter}>
                <SelectTrigger className="h-8 text-xs w-[160px]">
                  <SelectValue placeholder="All Lifecycles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    All Lifecycles
                  </SelectItem>
                  <SelectItem value="active" className="text-xs">
                    Active
                  </SelectItem>
                  <SelectItem value="deprecated" className="text-xs">
                    Deprecated
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* List with checkboxes */}
            <div className="flex-1 overflow-y-auto border rounded-lg">
              {filteredSkills.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No skills found</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-secondary/50 sticky top-0">
                    <tr className="border-b border-border">
                      <th className="w-10 px-3 py-2"></th>
                      <th className="text-left px-3 py-2 font-semibold">Skill Name</th>
                      <th className="text-left px-3 py-2 font-semibold">MCP Server</th>
                      <th className="text-left px-3 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSkills.map((skill) => (
                      <tr key={skill.id} className="border-b border-border hover:bg-secondary/30">
                        <td className="px-3 py-2.5">
                          <Checkbox
                            checked={selectedSkills.has(skill.id)}
                            onCheckedChange={(checked) => {
                              const newSelected = new Set(selectedSkills)
                              if (checked) {
                                newSelected.add(skill.id)
                              } else {
                                newSelected.delete(skill.id)
                              }
                              setSelectedSkills(newSelected)
                            }}
                          />
                        </td>
                        <td className="px-3 py-2.5 font-medium">{skill.name}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{skill.mcpServer}</td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              skill.status === "Active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            {skill.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
              onClick={() => setShowAttachSkillModal(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs bg-primary hover:bg-primary/90"
              onClick={handleAttachSkills}
              disabled={selectedSkills.size === 0}
            >
              Attach {selectedSkills.size > 0 && `(${selectedSkills.size})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
