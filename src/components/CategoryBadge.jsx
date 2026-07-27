import { CATEGORY_CONFIG } from "../utils/constants";

export function CategoryBadge({ category, size = "md" }) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  }[size];

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <Icon className={iconSizes} />
      {category || "General"}
    </span>
  );
}
