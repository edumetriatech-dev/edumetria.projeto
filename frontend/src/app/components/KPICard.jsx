"use client";

import { cn } from "@/app/lib/utils";
import { useEffect, useState } from "react";

const KPICard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  variant = "default",
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;

      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  const variants = {
    default: "bg-card",
    high: "bg-risk-high-bg border-l-4 border-l-risk-high",
    medium: "bg-risk-medium-bg border-l-4 border-l-risk-medium",
    low: "bg-risk-low-bg border-l-4 border-l-risk-low",
  };

  const iconVariants = {
    default: "text-primary bg-primary/10",
    high: "text-risk-high bg-risk-high/10",
    medium: "text-risk-medium bg-risk-medium/10",
    low: "text-risk-low bg-risk-low/10",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border p-6 shadow-sm",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="text-4xl font-bold text-foreground mt-2">
            {displayValue}
          </p>

          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>

        <div className={cn("p-3 rounded-lg", iconVariants[variant])}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
    </div>
  );
};

export default KPICard;