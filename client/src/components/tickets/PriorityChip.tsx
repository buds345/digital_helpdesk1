import React from "react";
import { Chip } from "@mui/material";

const priorityColors: Record<
  "low" | "medium" | "high" | "critical",
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  low: "success",
  medium: "info",
  high: "warning",
  critical: "error",
};

type Priority = keyof typeof priorityColors;

interface PriorityChipProps {
  priority: Priority;
}

const PriorityChip: React.FC<PriorityChipProps> = ({ priority }) => {
  const label = priority.charAt(0).toUpperCase() + priority.slice(1);

  return <Chip label={label} color={priorityColors[priority]} size="small" />;
};

export default PriorityChip;
