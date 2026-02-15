"use client";

import { cn } from "@/app/lib/utils";

const ProgressBar = ({
  value,
  level,
  showLabel = true,
  className,
}) => {
  const colors = {
    alto: "bg-risk-high",
    medio: "bg-risk-medium",
    baixo: "bg-risk-low",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            colors[level]
          )}
          style={{ width: `${value}%` }}
        />
      </div>

      {showLabel && (
        <span className="text-sm font-semibold text-muted-foreground min-w-[3rem] text-right">
          {value}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;