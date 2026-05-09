import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ChanceLevel } from "@/types";
import { cn } from "@/lib/utils";

interface ChanceBadgeProps {
  chance: ChanceLevel;
  size?: "sm" | "md";
}

const chanceConfig = {
  HIGH: {
    label: "High Chance",
    className: "bg-green-50 text-green-700 border border-green-200",
    Icon: TrendingUp,
  },
  MEDIUM: {
    label: "Medium Chance",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    Icon: Minus,
  },
  LOW: {
    label: "Low Chance",
    className: "bg-red-50 text-red-700 border border-red-200",
    Icon: TrendingDown,
  },
};

export default function ChanceBadge({ chance, size = "md" }: ChanceBadgeProps) {
  const config = chanceConfig[chance];
  const { Icon } = config;
  const textSize = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        config.className,
        textSize
      )}
    >
      <Icon size={size === "sm" ? 11 : 13} />
      {config.label}
    </span>
  );
}
