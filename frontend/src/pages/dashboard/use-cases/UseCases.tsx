
import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useActiveProfile } from "@/lib/hooks/use-active-profile"
import { useUseCases } from "@/lib/contexts/use-case-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Server, Sparkles, MoreVertical, Eye, Edit, Trash2, X } from "lucide-react"

export default function UseCasesPage() {
  const activeProfile = useActiveProfile()
  const { useCases: allUseCases } = useUseCases()
  const [searchQuery, setSearchQuery] = useState("")
  const [domainFilter, setDomainFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [buFilter, setBuFilter] = useState<string>("current")

  const isPlatformGovernance = activeProfile?.roleIds.includes("platform_governance") || false
  const canCreate =
    isPlatformGovernance ||
    activeProfile?.roleIds.includes("publisher") ||
    activeProfile?.roleIds.includes("product_admin") ||
    false

  const useCases = useMemo(() => {
    if (!activeProfile) return []

    if (buFilter === "all" && isPlatformGovernance) {
      return allUseCases
    } else if (buFilter === "current" && activeProfile.buId) {
      return allUseCases.filter((uc) => uc.buId === activeProfile.buId)
    } else if (buFilter !== "all" && buFilter !== "current") {
      return allUseCases.filter((uc) => uc.buId === buFilter)
    }

    return activeProfile.buId ? allUseCases.filter((uc) => uc.buId === activeProfile.buId) : []
  }, [activeProfile, buFilter, isPlatformGovernance, allUseCases])

  const summaryMetrics = useMemo(() => {
    return {
      total: useCases.length,
      approved: useCases.filter((uc) => uc.status === "active").length,
      inReview: useCases.filter((uc) => uc.status === "pending_product_admin" || uc.status === "pending_platform_admin")
        .length,
      draft: useCases.filter((uc) => uc.status === "draft").length,
      deprecated: useCases.filter((uc) => uc.status === "archived").length,
    }
  }, [useCases])

  const filteredUseCases = useMemo(() => {
    return useCases.filter((uc) => {
      const matchesSearch =
        uc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === "all" || uc.status === statusFilter

      const matchesDomain =
        domainFilter === "all" || uc.tags.some((tag) => tag.toLowerCase() === domainFilter.toLowerCase())

      return matchesSearch && matchesStatus && matchesDomain
    })
  }, [useCases, searchQuery, statusFilter, domainFilter])

  const handleResetFilters = () => {
    setSearchQuery("")
    setBuFilter("current")
    setStatusFilter("all")
    setDomainFilter("all")
  }

  const availableDomains = useMemo(() => {
    const domains = new Set<string>()
    useCases.forEach((uc) => {
      uc.tags.forEach((tag) => domains.add(tag))
    })
    return Array.from(domains).sort()
  }, [useCases])

  const truncateDescription = (text: string, maxLength = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  if (!activeProfile) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Use Cases</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isPlatformGovernance ? "Manage use cases across all business units" : `${activeProfile.buName} use cases`}
          </p>
        </div>
        {canCreate && (
          <Link href="/dashboard/use-cases/new">
            <Button className="gap-2 h-8 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Propose Use Case
            </Button>
          </Link>
        )}
      </div>

      {/* Summary metrics bar - 5 cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Total Use Cases</p>
            <p className="text-2xl font-bold text-foreground">{summaryMetrics.total}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Approved</p>
            <p className="text-2xl font-bold text-green-600">{summaryMetrics.approved}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">In Review</p>
            <p className="text-2xl font-bold text-amber-600">{summaryMetrics.inReview}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Draft</p>
            <p className="text-2xl font-bold text-muted-foreground">{summaryMetrics.draft}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Deprecated</p>
            <p className="text-2xl font-bold text-red-600">{summaryMetrics.deprecated}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-3">
          {/* Search bar - full width */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search use cases by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-3">
            {/* BU Filter */}
            {isPlatformGovernance && (
              <Select value={buFilter} onValueChange={setBuFilter}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Select BU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current BU</SelectItem>
                  <SelectItem value="all">All BUs</SelectItem>
                  <SelectItem value="bu-is">Networking (Intersight)</SelectItem>
                  <SelectItem value="bu-mr">Networking (Meraki)</SelectItem>
                  <SelectItem value="bu-te">Observability</SelectItem>
                  <SelectItem value="bu-sec">Security</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Lifecycle Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-8 text-xs">
                <SelectValue placeholder="Lifecycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_product_admin">Pending Review</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Domain Filter */}
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-[150px] h-8 text-xs">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {availableDomains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Reset Filters Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="h-8 gap-2 text-xs bg-transparent"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Use Cases Table */}
      {filteredUseCases.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No use cases found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search or filters"
                : canCreate
                  ? "Get started by creating your first business use case"
                  : "No use cases have been created yet"}
            </p>
            {canCreate && !searchQuery && (
              <Link href="/dashboard/use-cases/new">
                <Button className="mt-4">Propose Use Case</Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Name</TableHead>
                <TableHead className="text-xs font-semibold">Description</TableHead>
                <TableHead className="text-xs font-semibold">Owning BU</TableHead>
                <TableHead className="text-xs font-semibold">Domain</TableHead>
                <TableHead className="text-xs font-semibold">Lifecycle</TableHead>
                <TableHead className="text-xs font-semibold text-center">MCP Servers</TableHead>
                <TableHead className="text-xs font-semibold text-center">Skills</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUseCases.map((useCase) => (
                <TableRow key={useCase.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-xs">
                    <Link href={`/dashboard/use-cases/${useCase.id}`} className="text-primary hover:underline">
                      {useCase.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-md">
                    {truncateDescription(useCase.description)}
                  </TableCell>
                  <TableCell className="text-xs">{useCase.buName || "Unknown"}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant="outline" className="text-[11px]">
                      {useCase.tags[0] || "General"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <Badge
                      variant={
                        useCase.status === "active" ? "default" : useCase.status === "draft" ? "secondary" : "outline"
                      }
                      className="text-[11px]"
                    >
                      {useCase.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <div className="flex items-center justify-center gap-1.5">
                      <Server className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{useCase.mcpServerCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <div className="flex items-center justify-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{useCase.skillCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/use-cases/${useCase.id}`} className="cursor-pointer text-xs">
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {canCreate && (
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/use-cases/${useCase.id}/edit`} className="cursor-pointer text-xs">
                              <Edit className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {canCreate && (
                          <DropdownMenuItem className="text-destructive text-xs">
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
