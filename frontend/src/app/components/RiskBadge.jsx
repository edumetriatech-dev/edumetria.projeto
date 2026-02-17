"use client";

import { cn } from "@/app/lib/utils";

const RiskBadge = ({ level, className }) => {
  const variants = {
    alto: "bg-risk-high/10 text-risk-high border-risk-high",
    medio: "bg-risk-medium/10 text-risk-medium border-risk-medium",
    baixo: "bg-risk-low/10 text-risk-low border-risk-low",
  };

  const labels = {
    alto: "RISCO ALTO",
    medio: "RISCO MÉDIO",
    baixo: "RISCO BAIXO",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase border",
        variants[level],
        className
      )}
    >
      {labels[level]}
    </span>
  );
};

export default RiskBadge;