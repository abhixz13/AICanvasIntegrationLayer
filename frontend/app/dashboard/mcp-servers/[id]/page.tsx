"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Server, ExternalLink, Copy, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useActiveProfile } from "@/lib/hooks/use-active-profile"
import { fetchMcpServerById, deleteMcpServer, type McpServer } from "@/lib/api-mcp-servers"
import { fetchUseCaseById, type BusinessUseCase } from "@/lib/api-use-cases"
import { getBusinessUnits } from "@/lib/api"
import { type BusinessUnit } from "@/lib/types"

export default function McpServerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const activeProfile = useActiveProfile()
  const [server, setServer] = useState<McpServer | null>(null)
  const [useCase, setUseCase] = useState<BusinessUseCase | null>(null)
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState(searchParams?.get("tab") || "overview")
  const [manifestCopied, setManifestCopied] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    const loadServer = async () => {
      try {
        const data = await fetchMcpServerById(params.id as string)
        setServer(data)

        if (data?.business_use_case_id) {
          try {
            const uc = await fetchUseCaseById(data.business_use_case_id)
            setUseCase(uc)
          } catch (error) {
            console.error("[v0] Use case not found:", error)
            setUseCase(null)
          }
        }

        if (data?.bu_id) {
          try {
            const bus = await getBusinessUnits()
            const bu = bus.find((b) => b.id === data.bu_id)
            setBusinessUnit(bu || null)
          } catch (error) {
            console.error("[v0] Failed to load business units:", error)
            setBusinessUnit(null)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to load server:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServer()
  }, [params.id])

  const canEdit =
    activeProfile?.roleIds?.includes("platform_governance") ||
    activeProfile?.roleIds?.includes("product_admin") ||
    activeProfile?.roleIds?.includes("publisher")

  const isAdmin =
    activeProfile?.roleIds?.some((r) =>
      ["product_admin", "engineering_admin", "platform_governance"].includes(r),
    ) || false

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this MCP server?")) return

    setIsDeleting(true)
    const success = await deleteMcpServer(server!.id)
    if (success) {
      router.push("/dashboard/mcp-servers")
    } else {
      alert("Failed to delete server")
      setIsDeleting(false)
    }
  }

  const getLifecycleColor = (state: string) => {
    switch (state) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "in_review":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "draft":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
      case "deprecated":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getLifecycleLabel = (state: string) => {
    switch (state) {
      case "active":
        return "Approved"
      case "in_review":
        return "In Review"
      case "draft":
        return "Draft"
      case "deprecated":
        return "Deprecated"
      default:
        return state.charAt(0).toUpperCase() + state.slice(1)
    }
  }

  const copyManifest = () => {
    const manifest = JSON.stringify(mockManifest, null, 2)
    navigator.clipboard.writeText(manifest)
    setManifestCopied(true)
    setTimeout(() => setManifestCopied(false), 2000)
  }

  // Mock data for Skills, Manifest, and Audit History
  const mockSkills = [
    {
      id: "1",
      name: "get_network_topology",
      description: "Retrieves current network topology and device connections",
      risk_type: "read",
      use_cases: ["Network Monitoring"],
      status: "approved",
    },
    {
      id: "2",
      name: "analyze_path_trace",
      description: "Analyzes network path traces for connectivity issues",
      risk_type: "read",
      use_cases: ["Network Troubleshooting"],
      status: "approved",
    },
    {
      id: "3",
      name: "update_alert_config",
      description: "Updates alert configuration for network monitoring",
      risk_type: "write",
      use_cases: ["Network Monitoring"],
      status: "pending",
    },
  ]

  const mockManifest = {
    name: server?.name || "",
    version: "1.0.0",
    description: server?.description || "",
    skills: mockSkills.map((s) => ({
      name: s.name,
      description: s.description,
      parameters: {},
    })),
  }

  const mockAuditHistory = [
    {
      id: "1",
      timestamp: "2025-11-29T10:00:00Z",
      actor: "john.doe@cisco.com",
      action: "Created MCP Server",
    },
    {
      id: "2",
      timestamp: "2025-11-29T11:30:00Z",
      actor: "jane.smith@cisco.com",
      action: "Submitted for approval",
    },
    {
      id: "3",
      timestamp: "2025-11-29T14:00:00Z",
      actor: "platform.governance@cisco.com",
      action: "Approved",
    },
    {
      id: "4",
      timestamp: "2025-11-29T15:00:00Z",
      actor: "john.doe@cisco.com",
      action: "Updated manifest",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading server details...</div>
      </div>
    )
  }

  if (!server) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Server className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Server not found</h2>
        <Button onClick={() => router.push("/dashboard/mcp-servers")}>Back to Servers</Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Header Section */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">{server.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className={getLifecycleColor(server.lifecycle_state)}>
                {getLifecycleLabel(server.lifecycle_state)}
              </Badge>
              {businessUnit && (
                <Badge variant="secondary" className="text-sm">
                  {businessUnit.name}
                </Badge>
              )}
              <Badge variant="secondary" className="text-sm">
                {server.owner_email}
              </Badge>
              {useCase && (
                <Badge variant="outline" className="text-sm">
                  {useCase.title}
                </Badge>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/dashboard/mcp-servers/${server.id}/edit`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        {server.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {server.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
          <TabsTrigger value="manifest">Manifest</TabsTrigger>
          <TabsTrigger value="audit">Audit History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">{server.description || "No description provided"}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-sm">Business Unit</h4>
                <p className="text-sm text-muted-foreground">{businessUnit?.name || "Unknown"}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm">Owner Team</h4>
                <p className="text-sm text-muted-foreground">{server.owner_email}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm">Lifecycle</h4>
                <Badge variant="outline" className={getLifecycleColor(server.lifecycle_state)}>
                  {getLifecycleLabel(server.lifecycle_state)}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm">Skills Count</h4>
                <p className="text-sm text-muted-foreground">{mockSkills.length} skills</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm">Use Cases</h4>
                <p className="text-sm text-muted-foreground">{useCase ? "1 use case" : "0 use cases"}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm">Last Updated</h4>
                <p className="text-sm text-muted-foreground">{new Date(server.updated_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="pt-4 border-t text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Created: {new Date(server.created_at).toLocaleString()}</span>
                <span>Updated: {new Date(server.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="p-4 font-medium">Skill Name</th>
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium">Risk Type</th>
                    <th className="p-4 font-medium">Use Case(s)</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSkills.map((skill) => (
                    <tr
                      key={skill.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-medium font-mono text-sm">{skill.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{skill.description}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {skill.risk_type}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{skill.use_cases.join(", ")}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={
                            skill.status === "approved"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }
                        >
                          {skill.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Connectivity Tab */}
        <TabsContent value="connectivity" className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Endpoint Configuration</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Dev Endpoint URL</h4>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={server.endpoint_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-blue-400 hover:underline"
                    >
                      {server.endpoint_url}
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Prod Endpoint URL</h4>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm text-muted-foreground">
                      {server.endpoint_url.replace("dev", "prod")}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Authentication Type</h4>
                  <Badge variant="secondary">{server.auth_type.replace("_", " ").toUpperCase()}</Badge>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Connection Tests</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    {server.test_status === "passing" ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : server.test_status === "failing" ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-sm">Last Dev Connection Test</p>
                      <p className="text-xs text-muted-foreground">
                        {server.last_test_run
                          ? new Date(server.last_test_run).toLocaleString()
                          : "Never tested"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      server.test_status === "passing"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : server.test_status === "failing"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    }
                  >
                    {server.test_status || "unknown"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">Last Prod Connection Test</p>
                      <p className="text-xs text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">
                    pending
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Manifest Tab */}
        <TabsContent value="manifest" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Manifest File</h3>
              <Button variant="outline" size="sm" onClick={copyManifest}>
                <Copy className="w-4 h-4 mr-2" />
                {manifestCopied ? "Copied!" : "Copy"}
              </Button>
            </div>

            <div className="bg-black/40 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">{JSON.stringify(mockManifest, null, 2)}</pre>
            </div>

            <div className="pt-4">
              <h4 className="font-semibold mb-2 text-sm">Parsed Skills</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {mockSkills.length} skills defined in manifest
              </p>
              {mockSkills.length === mockSkills.filter((s) => s.status === "approved").length ? (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>All manifest skills are registered and approved</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-yellow-400">
                  <Clock className="w-4 h-4" />
                  <span>Some skills are pending approval</span>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Audit History Tab */}
        <TabsContent value="audit">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Audit History</h3>
            <div className="space-y-3">
              {mockAuditHistory.map((event, index) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 pb-3 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-400"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{event.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">by {event.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
