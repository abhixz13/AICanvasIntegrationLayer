import { CheckCircle2, Circle, Clock, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { BusinessUseCase, UseCaseApproval } from "@/lib/api-use-cases"

interface ApprovalWorkflowTimelineProps {
  useCase: BusinessUseCase
  approvals: UseCaseApproval[]
}

export function ApprovalWorkflowTimeline({ useCase, approvals }: ApprovalWorkflowTimelineProps) {
  const productAdminApproval = approvals.find((a) => a.approver_role === "product_admin")
  const platformAdminApproval = approvals.find((a) => a.approver_role === "platform_admin")

  const steps = [
    {
      label: "Created",
      date: useCase.created_at,
      status: "complete",
    },
    {
      label: "Product Admin Approval",
      date: productAdminApproval?.created_at,
      status: productAdminApproval
        ? productAdminApproval.action === "approved"
          ? "complete"
          : "rejected"
        : useCase.status === "pending_product_admin"
          ? "pending"
          : "inactive",
      approver: productAdminApproval?.approver_email,
      comments: productAdminApproval?.comments,
    },
    {
      label: "Platform Admin Approval",
      date: platformAdminApproval?.created_at,
      status: platformAdminApproval
        ? platformAdminApproval.action === "approved"
          ? "complete"
          : "rejected"
        : useCase.status === "pending_platform_admin"
          ? "pending"
          : "inactive",
      approver: platformAdminApproval?.approver_email,
      comments: platformAdminApproval?.comments,
    },
    {
      label: "Active",
      date: useCase.status === "active" ? useCase.updated_at : undefined,
      status: useCase.status === "active" ? "complete" : "inactive",
    },
  ]

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Approval Workflow</h2>

      <div className="relative flex items-start justify-between gap-4 overflow-x-auto pb-4">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const isComplete = step.status === "complete"
          const isPending = step.status === "pending"
          const isRejected = step.status === "rejected"
          const isInactive = step.status === "inactive"

          return (
            <div key={index} className="relative flex flex-col items-center min-w-[160px] flex-1">
              {/* Horizontal connecting line */}
              {!isLast && (
                <div
                  className={`absolute left-[50%] top-[16px] h-0.5 w-full ${isComplete ? "bg-green-500" : "bg-border"}`}
                />
              )}

              {/* Step Icon */}
              <div className="relative z-10 flex items-center justify-center mb-3">
                {isComplete ? (
                  <CheckCircle2 className="h-8 w-8 text-green-500 fill-green-500/10" />
                ) : isPending ? (
                  <Clock className="h-8 w-8 text-yellow-500 fill-yellow-500/10" />
                ) : isRejected ? (
                  <X className="h-8 w-8 text-red-500 fill-red-500/10" />
                ) : (
                  <Circle className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              {/* Step Content */}
              <div className="text-center">
                <div
                  className={`font-medium text-sm ${
                    isComplete
                      ? "text-green-500"
                      : isPending
                        ? "text-yellow-500"
                        : isRejected
                          ? "text-red-500"
                          : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </div>
                {step.date && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(step.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                )}
                {step.approver && <div className="text-xs text-muted-foreground mt-1">{step.approver}</div>}
                {isPending && <div className="text-xs text-yellow-500 mt-1">Awaiting approval</div>}
                {isRejected && <div className="text-xs text-red-500 mt-1">Rejected</div>}
                {step.comments && <div className="text-xs text-muted-foreground mt-1 italic">"{step.comments}"</div>}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
