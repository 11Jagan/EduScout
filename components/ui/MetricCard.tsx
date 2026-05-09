import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  highlight?: boolean;
  className?: string;
}

export default function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  highlight = false,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "card p-4 flex flex-col gap-1",
        highlight && "border-blue-200 bg-blue-50",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              highlight ? "bg-blue-100" : "bg-gray-100"
            )}
          >
            <Icon size={16} className={highlight ? "text-blue-700" : "text-gray-500"} />
          </div>
        )}
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className={cn("text-xl font-bold", highlight ? "text-blue-700" : "text-gray-900")}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
