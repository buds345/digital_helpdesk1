import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Ticket } from "../../types/ticket.types";
import StatusChip from "./StatusChip";
import PriorityChip from "./PriorityChip";

interface TicketCardProps {
    ticket: Ticket;
    onClick?: (ticketId: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
    const handleClick = () => {
        if (onClick) onClick(String(ticket.id));
    };

    // Parse createdAt safely (ticket.createdAt is string)
    const createdDate = ticket.createdAt ? new Date(ticket.createdAt) : new Date();

    const safeStatus = typeof ticket.status === "string" ? ticket.status : "open";
    const safePriority =
        typeof ticket.priority === "string" ? ticket.priority : "low";

    return (
        <Card
            sx={{
                mb: 2,
                cursor: onClick ? "pointer" : "default",
                "&:hover": { boxShadow: onClick ? 3 : undefined },
            }}
            onClick={handleClick}
        >
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                >
                    <Typography variant="h6" component="h3">
                        {ticket.title || "Untitled Ticket"}
                    </Typography>
                    <Box display="flex" gap={1}>
                        <StatusChip status={safeStatus} />
                        <PriorityChip priority={safePriority} />
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                    {ticket.description
                        ? ticket.description.substring(0, 100) + "..."
                        : "No description provided."}
                </Typography>

                <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption">#{ticket.id}</Typography>
                    <Typography variant="caption">
                        Created: {createdDate.toLocaleDateString()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TicketCard;
