import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    const normalized = status.toLowerCase().replace(/_/g, "-");
    
    switch (normalized) {
      case "draft":
        return "status-badge-draft";
      case "in-review":
      case "pending-product-admin":
      case "pending-governance":
        return "status-badge-in-review";
      case "approved":
        return "status-badge-approved";
      case "deprecated":
        return "status-badge-deprecated";
      default:
        return "status-badge-draft";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2 py-0.5 text-xs font-medium capitalize border-0",
        getStatusStyles(status),
        className
      )}
    >
      {formatStatus(status)}
    </Badge>
  );
}
