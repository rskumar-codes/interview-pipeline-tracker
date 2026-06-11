import { ApplicationStatus, STATUS_CONFIG } from "./types";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      style={{ color: config.color, background: config.bg, border: `1px solid ${config.color}30` }}
      className={`inline-flex items-center rounded font-medium tracking-wide ${
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs"
      }`}
    >
      {config.label}
    </span>
  );
}
