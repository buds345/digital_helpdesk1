import React, { useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    TextField,
    Pagination,
    Grid,
} from "@mui/material";
import TicketCard from "../../components/tickets/TicketCard";
import { Ticket } from "../../types/ticket.types";

interface TicketListProps {
    tickets: Ticket[];
    loading?: boolean;
    onTicketClick?: (ticketId: string) => void;
}

const TicketList: React.FC<TicketListProps> = ({
    tickets,
    loading,
    onTicketClick,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const filteredTickets = tickets.filter(
        (ticket) =>
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedTickets = filteredTickets.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Search Field */}
            <TextField
                label="Search tickets"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                }}
            />

            {/* No Tickets Message */}
            {paginatedTickets.length === 0 ? (
                <Typography variant="body1" align="center" mt={4}>
                    {searchTerm
                        ? "No matching tickets found"
                        : "No tickets available"}
                </Typography>
            ) : (
                <>
                    {/* Tickets Grid */}
                    <Grid container spacing={2}>
                        {paginatedTickets.map((ticket) => (

                            <TicketCard
                                ticket={ticket}
                                onClick={onTicketClick} // Pass directly
                            />

                        ))}
                    </Grid>

                    {/* Pagination */}
                    {filteredTickets.length > itemsPerPage && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={Math.ceil(filteredTickets.length / itemsPerPage)}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default TicketList;
