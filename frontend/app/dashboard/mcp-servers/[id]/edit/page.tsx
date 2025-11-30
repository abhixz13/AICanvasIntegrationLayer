"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useActiveProfile } from "@/lib/hooks/use-active-profile"
import { fetchMcpServerById, updateMcpServer, type McpServer } from "@/lib/api-mcp-servers"

export default function EditMcpServerPage() {
  const router = useRouter()
  const params = useParams()
  const { activeProfile } = useActiveProfile()
  const [server, setServer] = useState<McpServer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endpoint_url: "",
    auth_type: "none" as "none" | "api_key" | "oauth" | "basic",
    lifecycle_state: "draft" as "draft" | "active" | "deprecated" | "archived",
    tags: "",
  })

  useEffect(() => {
    const loadServer = async () => {
      const data = await fetchMcpServerById(params.id as string)
      if (data) {
        setServer(data)
        setFormData({
          name: data.name,
          description: data.description || "",
          endpoint_url: data.endpoint_url,
          auth_type: data.auth_type,
          lifecycle_state: data.lifecycle_state,
          tags: data.tags.join(", "),
        })
      }
      setIsLoading(false)
    }

    loadServer()
  }, [params.id])

  const canEdit = activeProfile?.email === server?.owner_email || activeProfile?.roleIds?.includes("platform_admin")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canEdit) return

    setIsSaving(true)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      await updateMcpServer(server!.id, {
        ...formData,
        tags: tagsArray,
      })

      router.push(`/mcp-servers/${server!.id}`)
    } catch (error) {
      console.error("[v0] Failed to update MCP server:", error)
      alert("Failed to update MCP server. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!server || !canEdit) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-semibold mb-2">Not authorized</h2>
        <Button onClick={() => router.push("/mcp-servers")}>Back to Servers</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit MCP Server</h1>
          <p className="text-muted-foreground mt-1">{server.name}</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Server Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint URL *</Label>
            <Input
              id="endpoint"
              required
              type="url"
              value={formData.endpoint_url}
              onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="auth">Authentication Type</Label>
              <Select
                value={formData.auth_type}
                onValueChange={(value: any) => setFormData({ ...formData, auth_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="api_key">API Key</SelectItem>
                  <SelectItem value="oauth">OAuth</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifecycle">Lifecycle State</Label>
              <Select
                value={formData.lifecycle_state}
                onValueChange={(value: any) => setFormData({ ...formData, lifecycle_state: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
