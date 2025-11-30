"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/lib/hooks/use-user-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ArrowRight, Briefcase, AlertTriangle, Server, Zap, FileText, AlertCircle, XCircle } from "lucide-react"

const mockPendingApprovals = {
  mcpServers: {
    count: 2,
    items: [
      {
        id: "1",
        name: "CustomerAuth-API-Gateway",
        submittedBy: "Mike Johnson",
        relativeTime: "2d ago",
        endpoint: "https://api.customer-auth.internal",
      },
      {
        id: "2",
        name: "PaymentProcessor-v2",
        submittedBy: "Sarah Chen",
        relativeTime: "5d ago",
        endpoint: "https://api.payments-v2.internal",
      },
    ],
  },
  skills: {
    count: 5,
    items: [
      { id: "1", name: "validate_payment_method", relativeTime: "1d ago" },
      { id: "2", name: "process_refund", relativeTime: "3d ago" },
      { id: "3", name: "check_inventory_status", relativeTime: "4d ago" },
      { id: "4", name: "update_customer_profile", relativeTime: "6d ago" },
      { id: "5", name: "generate_invoice", relativeTime: "7d ago" },
    ],
  },
  useCases: { count: 3 },
}

const mockTasks = [
  { id: "1", label: "2 MCP Servers need review", completed: false },
  { id: "2", label: "1 Use Case requires update", completed: false },
  { id: "3", label: "3 Skills in draft", completed: false },
]

const mockRecentActivity = [
  {
    type: "skill" as const,
    name: "run_trace",
    bu: "Meraki",
    product: "Meraki Dashboard",
    useCase: "WAN Degradation RCA",
    status: "Approved",
    relativeTime: "4d ago",
  },
  {
    type: "mcp" as const,
    name: "te_telemetry_mcp",
    bu: "ThousandEyes",
    product: "ThousandEyes Platform",
    useCase: "Root Cause Network Latency",
    status: "Registered",
    relativeTime: "2d ago",
  },
  {
    type: "usecase" as const,
    name: "WAN Degradation RCA",
    bu: "Networking",
    product: "Meraki Dashboard",
    useCase: "WAN Degradation RCA",
    status: "New",
    relativeTime: "7d ago",
  },
  {
    type: "mcp" as const,
    name: "meraki_wan_observability",
    bu: "Meraki",
    product: "Meraki Dashboard",
    useCase: "Branch Connectivity Incident",
    status: "Active",
    relativeTime: "1w ago",
  },
  {
    type: "skill" as const,
    name: "get_wan_path_health",
    bu: "Meraki",
    product: "Meraki Dashboard",
    useCase: "Branch Connectivity Incident",
    status: "Approved",
    relativeTime: "3d ago",
  },
  {
    type: "usecase" as const,
    name: "Root Cause Network Latency",
    bu: "ThousandEyes",
    product: "ThousandEyes Platform",
    useCase: "Root Cause Network Latency",
    status: "In Progress",
    relativeTime: "5d ago",
  },
  {
    type: "skill" as const,
    name: "fetch_device_status",
    bu: "Networking",
    product: "Intersight",
    useCase: "Server Health Monitoring",
    status: "Pending Review",
    relativeTime: "1d ago",
  },
  {
    type: "mcp" as const,
    name: "webex_meetings_mcp",
    bu: "Collaboration",
    product: "Webex",
    useCase: "Meeting Analytics",
    status: "Registered",
    relativeTime: "6d ago",
  },
]

const mockBusinessUnits = [
  { id: "all", name: "All BUs" },
  { id: "bu-is", name: "Networking (Intersight)" },
  { id: "bu-mr", name: "Meraki" },
  { id: "bu-te", name: "Observability (ThousandEyes)" },
  { id: "bu-sec", name: "Security" },
]

const mockProducts = [
  { id: "all", name: "All Products" },
  { id: "webex", name: "Webex" },
  { id: "catalyst-center", name: "Catalyst Center" },
  { id: "sd-wan", name: "SD-WAN" },
  { id: "meraki-dashboard", name: "Meraki Dashboard" },
]

export default function DashboardPage() {
  const { businessUnit } = useUserContext()
  const router = useRouter()

  const [tasks, setTasks] = useState(mockTasks)
  const [mcpModalOpen, setMcpModalOpen] = useState(false)
  const [skillsModalOpen, setSkillsModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [selectedBuFilter, setSelectedBuFilter] = useState("all")
  const [coverageScope, setCoverageScope] = useState<"all" | "bu" | "product">("all")
  const [selectedScopeItem, setSelectedScopeItem] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [changesSearch, setChangesSearch] = useState("")

  const getCoverageMetrics = () => {
    if (coverageScope === "all") {
      return {
        topMetric: "Integrated BUs: 4 / 6",
        topSubtext: "Target: 6 priority BUs",
        progress: 66.7,
        table: {
          mcpLive: 12,
          mcpReview: 2,
          skillsLive: 78,
          skillsReview: 5,
          useCasesLive: 9,
          useCasesReview: 3,
        },
        velocity: "+2 MCPs · +6 Skills · +1 Use Case",
      }
    } else if (coverageScope === "bu") {
      const buName = selectedScopeItem || "Networking (Intersight)"
      return {
        topMetric: `${buName} — Use Cases integrated: 3 / 5`,
        topSubtext: "Target: 5 priority use cases",
        progress: 60,
        table: {
          mcpLive: 4,
          mcpReview: 1,
          skillsLive: 23,
          skillsReview: 2,
          useCasesLive: 3,
          useCasesReview: 1,
        },
        velocity: "+1 MCP · +3 Skills · +1 Use Case",
      }
    } else {
      const productName = selectedScopeItem || "Webex"
      return {
        topMetric: `${productName} — Use Cases integrated: 2 / 4`,
        topSubtext: "Target: 4 priority use cases",
        progress: 50,
        table: {
          mcpLive: 3,
          mcpReview: 0,
          skillsLive: 15,
          skillsReview: 1,
          useCasesLive: 2,
          useCasesReview: 1,
        },
        velocity: "+1 MCP · +2 Skills · +0 Use Case",
      }
    }
  }

  // TODO: Add actual velocity data from API
  const metrics = {
    ...getCoverageMetrics(),
    velocity: {
      thisWeek: "+2 MCPs · +6 Skills · +1 Use Case",
      lastWeek: "+1 MCP · +3 Skills · +0 Use Case",
    },
  }

  const getCategorizedActivities = () => {
    const mcpActivities = mockRecentActivity.filter((a) => a.type === "mcp").slice(0, 3)
    const skillActivities = mockRecentActivity.filter((a) => a.type === "skill").slice(0, 3)
    const useCaseActivities = mockRecentActivity.filter((a) => a.type === "usecase").slice(0, 2)

    return { mcpActivities, skillActivities, useCaseActivities }
  }

  const { mcpActivities, skillActivities, useCaseActivities } = getCategorizedActivities()

  const getActivityIcon = (type: "mcp" | "skill" | "usecase") => {
    switch (type) {
      case "mcp":
        return <Server className="h-4 w-4 text-blue-600" />
      case "skill":
        return <Zap className="h-4 w-4 text-amber-600" />
      case "usecase":
        return <FileText className="h-4 w-4 text-purple-600" />
    }
  }

  const uniqueUseCases = Array.from(new Set(mockRecentActivity.map((a) => a.useCase))).sort()
  const uniqueProducts = Array.from(new Set(mockRecentActivity.map((a) => a.product))).sort()

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold text-foreground">Integration Platform — PM Overview</h1>
            <p className="text-xs text-muted-foreground">Context: All BUs · Persona: Integration PM</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">BU:</span>
            <Select value={selectedBuFilter} onValueChange={setSelectedBuFilter}>
              <SelectTrigger className="w-[180px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockBusinessUnits.map((bu) => (
                  <SelectItem key={bu.id} value={bu.id}>
                    {bu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-base font-bold text-foreground">Today's Priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-foreground">Critical Blockers</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => router.push("/dashboard/use-cases?filter=blocked")}
                  className="w-full flex items-start gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 transition-colors text-left"
                >
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-red-900 dark:text-red-400">2 P0 Use Cases blocked</p>
                    <p className="text-[11px] text-red-700 dark:text-red-500">Missing MCPs</p>
                  </div>
                </button>
                <button
                  onClick={() => router.push("/dashboard/use-cases?filter=wan-degradation")}
                  className="w-full flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 transition-colors text-left"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-amber-900 dark:text-amber-400">1 BU not integrated</p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-500">WAN Degradation RCA</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="space-y-2">
              <button
                onClick={() => router.push("/dashboard/approvals")}
                className="w-full flex items-center justify-between hover:opacity-80 transition-opacity group"
              >
                <h3 className="text-xs font-semibold text-foreground">Approvals</h3>
                <ArrowRight className="h-3 w-3 text-primary" />
              </button>
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1 text-xs">
                  <span className="text-foreground">MCP approvals:</span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">2 pending</span> · avg{" "}
                    <span className="font-medium">4 days</span>
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 text-xs">
                  <span className="text-foreground">Skill approvals:</span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">5 pending</span> · avg{" "}
                    <span className="font-medium">2 days</span>
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 text-xs">
                  <span className="text-foreground">Use Case approvals:</span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">3 pending</span> · avg{" "}
                    <span className="font-medium">6 days</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-foreground">Quick Actions</h3>
              <div className="space-y-1.5">
                <Button
                  size="sm"
                  className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs"
                  onClick={() => router.push("/dashboard/mcp-servers/create")}
                >
                  <Plus className="h-3 w-3" />
                  Register MCP Server
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start gap-2 border-border hover:bg-secondary bg-transparent h-8 text-xs"
                  onClick={() => router.push("/dashboard/use-cases/create")}
                >
                  <Briefcase className="h-3 w-3" />
                  Create / Edit Use Case
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-bold text-foreground">Integration Coverage</CardTitle>
            <Select
              value={coverageScope}
              onValueChange={(value: "all" | "bu" | "product") => {
                setCoverageScope(value)
                setSelectedScopeItem("") // Clear when scope changes
              }}
            >
              <SelectTrigger className="w-[120px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="bu">By BU</SelectItem>
                <SelectItem value="product">By Product</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          {coverageScope === "bu" && (
            <div className="px-4 pb-2">
              <Select value={selectedScopeItem} onValueChange={setSelectedScopeItem}>
                <SelectTrigger className="w-full h-7 text-xs">
                  <SelectValue placeholder="Select a BU..." />
                </SelectTrigger>
                <SelectContent>
                  {mockBusinessUnits
                    .filter((bu) => bu.id !== "all")
                    .map((bu) => (
                      <SelectItem key={bu.id} value={bu.name}>
                        {bu.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {coverageScope === "product" && (
            <div className="px-4 pb-2">
              <Select value={selectedScopeItem} onValueChange={setSelectedScopeItem}>
                <SelectTrigger className="w-full h-7 text-xs">
                  <SelectValue placeholder="Select a Product..." />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts
                    .filter((product) => product.id !== "all")
                    .map((product) => (
                      <SelectItem key={product.id} value={product.name}>
                        {product.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <CardContent className="space-y-4 px-4 pb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-foreground">{metrics.topMetric}</h3>
              </div>
              <Progress value={metrics.progress} className="h-1.5 bg-secondary [&>div]:bg-primary" />
              <p className="text-[11px] text-muted-foreground">{metrics.topSubtext}</p>
            </div>

            <div className="border-t border-border" />

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-foreground">Objects Coverage</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-2 py-1.5 font-semibold text-foreground">Type</th>
                      <th className="text-right px-2 py-1.5 font-semibold text-foreground">Live</th>
                      <th className="text-right px-2 py-1.5 font-semibold text-foreground">In Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr
                      className="hover:bg-secondary/30 cursor-pointer transition-colors"
                      onClick={() => router.push(`/dashboard/mcp-servers?scope=${coverageScope}`)}
                    >
                      <td className="px-2 py-1.5 text-foreground">MCP Servers</td>
                      <td className="px-2 py-1.5 text-right font-semibold text-foreground">{metrics.table.mcpLive}</td>
                      <td className="px-2 py-1.5 text-right text-muted-foreground">{metrics.table.mcpReview}</td>
                    </tr>
                    <tr
                      className="hover:bg-secondary/30 cursor-pointer transition-colors"
                      onClick={() => router.push(`/dashboard/skills?scope=${coverageScope}`)}
                    >
                      <td className="px-2 py-1.5 text-foreground">Skills</td>
                      <td className="px-2 py-1.5 text-right font-semibold text-foreground">
                        {metrics.table.skillsLive}
                      </td>
                      <td className="px-2 py-1.5 text-right text-muted-foreground">{metrics.table.skillsReview}</td>
                    </tr>
                    <tr
                      className="hover:bg-secondary/30 cursor-pointer transition-colors"
                      onClick={() => router.push(`/dashboard/use-cases?scope=${coverageScope}`)}
                    >
                      <td className="px-2 py-1.5 text-foreground">Use Cases</td>
                      <td className="px-2 py-1.5 text-right font-semibold text-foreground">
                        {metrics.table.useCasesLive}
                      </td>
                      <td className="px-2 py-1.5 text-right text-muted-foreground">{metrics.table.useCasesReview}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-foreground">Recent Velocity</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-secondary/30 rounded-lg">
                  <p className="text-[11px] text-muted-foreground">This Week</p>
                  <p className="text-sm font-semibold text-foreground">{metrics.velocity.thisWeek}</p>
                </div>
                <div className="p-2 bg-secondary/30 rounded-lg">
                  <p className="text-[11px] text-muted-foreground">Last Week</p>
                  <p className="text-sm font-semibold text-foreground">{metrics.velocity.lastWeek}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card flex flex-col">
          <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-bold text-foreground">Recent Changes</CardTitle>
            <Input
              placeholder="Search changes..."
              value={changesSearch}
              onChange={(e) => setChangesSearch(e.target.value)}
              className="w-[160px] h-7 text-xs"
            />
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-3 pt-3 px-4 pb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 mb-2">
                <Server className="h-3 w-3 text-blue-600" />
                <h3 className="text-xs font-semibold text-foreground">MCP Servers</h3>
              </div>
              {mcpActivities.length === 0 ? (
                <p className="text-[11px] text-muted-foreground pl-5">No recent changes</p>
              ) : (
                mcpActivities.map((activity, index) => (
                  <button
                    key={`mcp-${index}`}
                    className="w-full flex items-start gap-2 p-1.5 pl-5 rounded hover:bg-secondary transition-colors text-left"
                    onClick={() => router.push("/dashboard/mcp-servers")}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">
                        <span className="font-medium">{activity.name}</span> — {activity.bu}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {activity.status} · {activity.relativeTime}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="border-t" />

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-3 w-3 text-amber-600" />
                <h3 className="text-xs font-semibold text-foreground">Skills</h3>
              </div>
              {skillActivities.length === 0 ? (
                <p className="text-[11px] text-muted-foreground pl-5">No recent changes</p>
              ) : (
                skillActivities.map((activity, index) => (
                  <button
                    key={`skill-${index}`}
                    className="w-full flex items-start gap-2 p-1.5 pl-5 rounded hover:bg-secondary transition-colors text-left"
                    onClick={() => router.push("/dashboard/skills")}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">
                        <span className="font-medium">{activity.name}</span> — {activity.bu}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {activity.status} · {activity.relativeTime}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="border-t" />

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-3 w-3 text-purple-600" />
                <h3 className="text-xs font-semibold text-foreground">Use Cases</h3>
              </div>
              {useCaseActivities.length === 0 ? (
                <p className="text-[11px] text-muted-foreground pl-5">No recent changes</p>
              ) : (
                useCaseActivities.map((activity, index) => (
                  <button
                    key={`usecase-${index}`}
                    className="w-full flex items-start gap-2 p-1.5 pl-5 rounded hover:bg-secondary transition-colors text-left"
                    onClick={() => router.push("/dashboard/use-cases")}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">
                        <span className="font-medium">{activity.name}</span> — {activity.bu}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {activity.status} · {activity.relativeTime}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="border-t" />

            <button
              onClick={() => router.push("/dashboard/activity")}
              className="w-full text-center text-xs text-primary hover:text-primary/80 font-medium transition-colors pt-2"
            >
              View full activity log →
            </button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-base font-bold text-foreground">Use Case Coverage by BU</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left px-2 py-1.5 font-semibold text-foreground sticky left-0 bg-secondary/50">
                      Use Case
                    </th>
                    <th className="text-center px-2 py-1.5 font-semibold text-foreground min-w-[100px]">Meraki</th>
                    <th className="text-center px-2 py-1.5 font-semibold text-foreground min-w-[100px]">
                      ThousandEyes
                    </th>
                    <th className="text-center px-2 py-1.5 font-semibold text-foreground min-w-[100px]">AppDynamics</th>
                    <th className="text-center px-2 py-1.5 font-semibold text-foreground min-w-[100px]">Intersight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-secondary/30 transition-colors">
                    <td className="px-2 py-1.5 text-foreground font-medium sticky left-0 bg-card">
                      WAN Degradation RCA
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Live
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        In Progress
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Live
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                        Not Started
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary/30 transition-colors">
                    <td className="px-2 py-1.5 text-foreground font-medium sticky left-0 bg-card">Network Health</td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Live
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Live
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        In Progress
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Live
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary/30 transition-colors">
                    <td className="px-2 py-1.5 text-foreground font-medium sticky left-0 bg-card">Security Incident</td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                        Not Started
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                        Not Started
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        In Progress
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Live
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary/30 transition-colors">
                    <td className="px-2 py-1.5 text-foreground font-medium sticky left-0 bg-card">
                      API Performance Analysis
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        In Progress
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Live
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                        Not Started
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        In Progress
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-base font-bold text-foreground">Risk & Quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-4 pb-4">
            <button
              onClick={() => router.push("/dashboard/mcp-servers?filter=deprecated")}
              className="w-full flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 transition-colors text-left"
            >
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-400">
                  3 Deprecated MCPs still in use
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Review and migrate</p>
              </div>
            </button>

            <button
              onClick={() => router.push("/dashboard/skills?filter=orphan")}
              className="w-full flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 transition-colors text-left"
            >
              <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-400">7 Orphan Skills (no Use Case)</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Assign or deprecate</p>
              </div>
            </button>

            <button
              onClick={() => router.push("/dashboard/analytics?view=failing-tests")}
              className="w-full flex items-start gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 transition-colors text-left"
            >
              <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-red-900 dark:text-red-400">2 MCPs failing tests</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Open Analytics →
                  </button>
                </p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={mcpModalOpen} onOpenChange={setMcpModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pending MCP Server Approvals ({mockPendingApprovals.mcpServers.count})</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {mockPendingApprovals.mcpServers.items.map((server) => (
              <div key={server.id} className="border border-border rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">{server.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Submitted: {server.relativeTime} by {server.submittedBy}
                  </p>
                  <p className="text-sm text-muted-foreground">Endpoint: {server.endpoint}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMcpModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={skillsModalOpen} onOpenChange={setSkillsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pending Skill Approvals ({mockPendingApprovals.skills.count})</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {mockPendingApprovals.skills.items.slice(0, 3).map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 rounded hover:bg-secondary">
                <span className="text-sm text-foreground">{skill.name}</span>
                <span className="text-sm text-muted-foreground">{skill.relativeTime}</span>
              </div>
            ))}
            <p className="text-sm text-muted-foreground text-center pt-2">+ 2 more</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkillsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register New MCP Server</DialogTitle>
            <DialogDescription>Note: This is a demo form - submission not functional in Phase 1</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-name">Server Name</Label>
              <Input id="server-name" placeholder="e.g., CustomerAuth-API" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endpoint-url">Endpoint URL</Label>
              <Input id="endpoint-url" type="url" placeholder="https://api.example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-type">Authentication Type</Label>
              <Select>
                <SelectTrigger id="auth-type">
                  <SelectValue placeholder="Select authentication type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oauth">OAuth 2.0</SelectItem>
                  <SelectItem value="api-key">API Key</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} placeholder="Describe the MCP server..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegisterModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setRegisterModalOpen(false)}>Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
