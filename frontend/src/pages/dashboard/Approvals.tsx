
import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useActiveProfile } from "@/lib/hooks/use-active-profile"
import { useUseCases } from "@/lib/contexts/use-case-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Clock, Briefcase } from "lucide-react"

export default function ApprovalsPage() {
  const activeProfile = useActiveProfile()
  const { getPendingApprovals } = useUseCases()

  const isPlatformGovernance = activeProfile?.roleIds.includes("platform_governance") || false
  const isProductAdmin = activeProfile?.roleIds.includes("product_admin") || false

  const pendingApprovals = useMemo(() => {
    if (!activeProfile) return []

    if (isPlatformGovernance) {
      return getPendingApprovals(undefined, "platform_governance")
    } else if (isProductAdmin) {
      return getPendingApprovals(activeProfile.buId, "product_admin")
    }

    return []
  }, [activeProfile, getPendingApprovals, isPlatformGovernance, isProductAdmin])

  if (!activeProfile) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isPlatformGovernance && !isProductAdmin) {
    return (
      <div className="p-8">
        <Card className="p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to view approvals.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pending Approvals</h1>
        <p className="text-muted-foreground mt-1">
          {isPlatformGovernance
            ? "Review and approve use cases as Platform Admin"
            : "Review and approve use cases for your business unit"}
        </p>
      </div>

      {/* Approvals List */}
      {pendingApprovals.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <CheckSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No Pending Approvals</h3>
            <p className="text-muted-foreground">All use cases have been reviewed</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((useCase) => (
            <Link key={useCase.id} href={`/dashboard/use-cases/${useCase.id}`}>
              <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg text-foreground">{useCase.title}</h3>
                      <Badge variant="secondary" className="gap-1.5">
                        <Clock className="h-3 w-3" />
                        {useCase.status === "pending_product_admin" ? "Product Admin Review" : "Platform Admin Review"}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground line-clamp-2">{useCase.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        <strong>BU:</strong> {useCase.buName}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Owner:</strong> {useCase.owner}
                      </span>
                      <span>•</span>
                      <span>Created {new Date(useCase.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Button className="gap-2">
                    Review
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
