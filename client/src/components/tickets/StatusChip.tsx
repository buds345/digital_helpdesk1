import React from "react";
import { Chip } from "@mui/material";
import { TicketStatus } from "../../types/ticket.types";

const statusColors: Record<
  TicketStatus,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  open: "warning",
  in_progress: "primary",
  waiting_on_client: "secondary",
  resolved: "success",
  closed: "default",
};

interface StatusChipProps {
  status: TicketStatus;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const label = status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return <Chip label={label} color={statusColors[status]} size="small" />;
};

export default StatusChip;
