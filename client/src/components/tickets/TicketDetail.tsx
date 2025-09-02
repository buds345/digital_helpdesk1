import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Paper } from '@mui/material';
import { getTicket } from '../../api/ticket.api';
import { Ticket } from '../../types/ticket.types';
import StatusChip from './StatusChip';
import PriorityChip from './PriorityChip';

const TicketDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                if (!id) {
                    setError('Invalid ticket ID');
                    return;
                }
                const data = await getTicket(id);
                setTicket(data);
            } catch (err) {
                setError('Failed to load ticket details');
                console.error('Error fetching ticket:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!ticket) {
        return (
            <Box p={3}>
                <Typography variant="h6">Ticket not found</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h4">{ticket.title}</Typography>
                    <Box display="flex" gap={1}>
                        <StatusChip status={ticket.status} />
                        <PriorityChip priority={ticket.priority} />
                    </Box>
                </Box>

                <Typography variant="body1" paragraph>
                    {ticket.description}
                </Typography>

                <Box mt={2}>
                    <Typography variant="subtitle2">Created: {new Date(ticket.createdAt).toLocaleString()}</Typography>
                    {ticket.updatedAt && (
                        <Typography variant="subtitle2">Last Updated: {new Date(ticket.updatedAt).toLocaleString()}</Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default TicketDetail;