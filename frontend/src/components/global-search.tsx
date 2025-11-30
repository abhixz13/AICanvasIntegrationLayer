"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Server, FileText, Loader2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { fetchMcpServers, type McpServer } from "@/lib/api-mcp-servers"
import { fetchUseCases, type BusinessUseCase } from "@/lib/api-use-cases"
import { getBusinessUnits } from "@/lib/api"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

type SkillResult = {
  id: string
  name: string
  description: string
  mcpServerId: string
  mcpServerName: string
}

type SearchResult =
  | { type: "mcp_server"; data: McpServer }
  | { type: "use_case"; data: BusinessUseCase }
  | { type: "skill"; data: SkillResult }

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Mock skills data - in production, this would come from an API
  const mockSkills: SkillResult[] = [
    {
      id: "1",
      name: "get_network_topology",
      description: "Retrieves current network topology and device connections",
      mcpServerId: "mcp-1",
      mcpServerName: "ThousandEyes Monitoring MCP",
    },
    {
      id: "2",
      name: "analyze_path_trace",
      description: "Analyzes network path traces for connectivity issues",
      mcpServerId: "mcp-1",
      mcpServerName: "ThousandEyes Monitoring MCP",
    },
    {
      id: "3",
      name: "update_alert_config",
      description: "Updates alert configuration for network monitoring",
      mcpServerId: "mcp-1",
      mcpServerName: "ThousandEyes Monitoring MCP",
    },
  ]

  // Search function with debouncing
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)

    try {
      const [servers, useCases, businessUnits] = await Promise.all([
        fetchMcpServers(),
        fetchUseCases(),
        getBusinessUnits(),
      ])

      const lowerQuery = searchQuery.toLowerCase()

      // Filter MCP servers (including BU names and owner emails)
      const matchedServers = servers
        .filter((server) => {
          const bu = businessUnits.find((b) => b.id === server.bu_id)
          return (
            server.name.toLowerCase().includes(lowerQuery) ||
            server.description?.toLowerCase().includes(lowerQuery) ||
            server.endpoint_url.toLowerCase().includes(lowerQuery) ||
            server.owner_email.toLowerCase().includes(lowerQuery) ||
            server.owner_team.toLowerCase().includes(lowerQuery) ||
            bu?.name.toLowerCase().includes(lowerQuery) ||
            server.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
          )
        })
        .slice(0, 5)
        .map((data): SearchResult => ({ type: "mcp_server", data }))

      // Filter skills
      const matchedSkills = mockSkills
        .filter(
          (skill) =>
            skill.name.toLowerCase().includes(lowerQuery) ||
            skill.description.toLowerCase().includes(lowerQuery) ||
            skill.mcpServerName.toLowerCase().includes(lowerQuery),
        )
        .slice(0, 5)
        .map((data): SearchResult => ({ type: "skill", data }))

      // Filter use cases
      const matchedUseCases = useCases
        .filter(
          (useCase) =>
            useCase.title.toLowerCase().includes(lowerQuery) ||
            useCase.description?.toLowerCase().includes(lowerQuery) ||
            useCase.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
        )
        .slice(0, 5)
        .map((data): SearchResult => ({ type: "use_case", data }))

      setResults([...matchedServers, ...matchedSkills, ...matchedUseCases])
    } catch (error) {
      console.error("[v0] Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  const handleSelect = (result: SearchResult) => {
    if (result.type === "mcp_server") {
      router.push(`/dashboard/mcp-servers/${result.data.id}`)
    } else if (result.type === "skill") {
      // Navigate to parent MCP and auto-open Skills tab
      router.push(`/dashboard/mcp-servers/${result.data.mcpServerId}?tab=skills`)
    } else if (result.type === "use_case") {
      router.push(`/dashboard/use-cases/${result.data.id}`)
    }
    setOpen(false)
    setQuery("")
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 shrink-0" />
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search MCP servers, use cases..." value={query} onValueChange={setQuery} />
        <CommandList>
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && query.length >= 2 && results.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}

          {!isLoading && results.length > 0 && (
            <>
              {results.some((r) => r.type === "mcp_server") && (
                <CommandGroup heading="MCP Servers">
                  {results
                    .filter((r) => r.type === "mcp_server")
                    .map((result) => {
                      const server = result.data as McpServer
                      return (
                        <CommandItem key={server.id} value={server.id} onSelect={() => handleSelect(result)}>
                          <Server className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col flex-1">
                            <span className="font-medium">{server.name}</span>
                            {server.description && (
                              <span className="text-xs text-muted-foreground line-clamp-1">{server.description}</span>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {server.lifecycle_state}
                          </Badge>
                        </CommandItem>
                      )
                    })}
                </CommandGroup>
              )}

              {results.some((r) => r.type === "skill") && (
                <CommandGroup heading="Skills">
                  {results
                    .filter((r) => r.type === "skill")
                    .map((result) => {
                      const skill = result.data as SkillResult
                      return (
                        <CommandItem key={skill.id} value={skill.id} onSelect={() => handleSelect(result)}>
                          <Zap className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col flex-1">
                            <span className="font-medium font-mono text-sm">{skill.name}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{skill.description}</span>
                          </div>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {skill.mcpServerName}
                          </Badge>
                        </CommandItem>
                      )
                    })}
                </CommandGroup>
              )}

              {results.some((r) => r.type === "use_case") && (
                <CommandGroup heading="Business Use Cases">
                  {results
                    .filter((r) => r.type === "use_case")
                    .map((result) => {
                      const useCase = result.data as BusinessUseCase
                      return (
                        <CommandItem key={useCase.id} value={useCase.id} onSelect={() => handleSelect(result)}>
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col flex-1">
                            <span className="font-medium">{useCase.title}</span>
                            {useCase.description && (
                              <span className="text-xs text-muted-foreground line-clamp-1">{useCase.description}</span>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {useCase.status}
                          </Badge>
                        </CommandItem>
                      )
                    })}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
