import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Snackbar,
    Card,
    CardContent,
    Paper,
    Chip,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

import { Ticket, TicketCreate } from '../../../types/ticket.types';
import { getTickets, createTicket } from '../../../api/ticket.api';
import StatusChip from '../../../components/tickets/StatusChip';
import PriorityChip from '../../../components/tickets/PriorityChip';
import { useAuth } from '../../../contexts/AuthContext';

const services = [
    { id: 1, name: 'Website Update' },
    { id: 2, name: 'System Bug' },
    { id: 3, name: 'Dashboard Maintenance' },
    { id: 4, name: 'Hosting' },
    { id: 5, name: 'Email Support' },
];

interface Stats {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
}

// Custom styled components
const GradientCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
    },
}));

const StatsCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
    },
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 'none',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    '& .MuiDataGrid-main': {
        borderRadius: 16,
    },
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderRadius: '16px 16px 0 0',
        border: 'none',
    },
    '& .MuiDataGrid-cell': {
        borderColor: 'rgba(0,0,0,0.05)',
    },
    '& .MuiDataGrid-row': {
        '&:nth-of-type(even)': {
            backgroundColor: 'rgba(102, 126, 234, 0.02)',
        },
        '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.05)',
        },
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    borderRadius: 25,
    color: 'white',
    padding: '10px 30px',
    boxShadow: '0 3px 15px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
    },
}));

const ClientDashboard: React.FC = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState<Stats>({ open: 0, inProgress: 0, resolved: 0, closed: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // Removed priority from newTicket - clients can't set priority anymore
    const [newTicket, setNewTicket] = useState<Omit<TicketCreate, 'priority'>>({
        title: '',
        description: '',
        serviceId: services[0].id,
    });

    const fetchTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getTickets();

            // Handle backend response format { data: tickets }
            let ticketsData: Ticket[] = [];
            if (Array.isArray(response)) {
                ticketsData = response;
            } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
                ticketsData = (response as any).data;
            } else {
                console.error('API response format unexpected:', response);
                throw new Error('Invalid data format received from server');
            }

            setTickets(ticketsData);
            setStats({
                open: ticketsData.filter((t) => t.status === 'open').length,
                inProgress: ticketsData.filter((t) => t.status === 'in_progress').length,
                resolved: ticketsData.filter((t) => t.status === 'resolved').length,
                closed: ticketsData.filter((t) => t.status === 'closed').length,
            });
        } catch (err) {
            console.error('Error fetching tickets:', err);

            // More specific error handling
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to load tickets. Please try again.');
            }

            // Set empty array as fallback
            setTickets([]);
            setStats({ open: 0, inProgress: 0, resolved: 0, closed: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();

        // Set up polling to refresh data every 30 seconds
        // This ensures clients see status updates made by admins
        const interval = setInterval(fetchTickets, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateTicket = async () => {
        if (!newTicket.title.trim() || !newTicket.description.trim()) {
            setError('Title and description are required.');
            return;
        }

        try {
            // Create ticket without priority - backend will set default priority
            const ticketToCreate: TicketCreate = {
                ...newTicket,
                priority: 'medium' // Default priority, admin can change later
            };

            const response = await createTicket(ticketToCreate);

            // Handle backend response format { data: ticket }
            let createdTicket;
            if (response && typeof response === 'object' && 'data' in response) {
                createdTicket = (response as any).data;
            } else {
                createdTicket = response;
            }

            if (!createdTicket || typeof createdTicket.id === 'undefined') {
                throw new Error('Invalid response from server when creating ticket');
            }

            setSuccessMessage(`Ticket #${createdTicket.id} created successfully. Priority will be assigned by admin.`);
            setCreateDialogOpen(false);
            setNewTicket({ title: '', description: '', serviceId: services[0].id });

            // Refresh the tickets list
            fetchTickets();
        } catch (err) {
            console.error('Error creating ticket:', err);
            if (err instanceof Error) {
                setError(`Failed to create ticket: ${err.message}`);
            } else {
                setError('Failed to create ticket. Please try again.');
            }
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Ticket ID',
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={`#${params.row.id}`}
                    size="small"
                    sx={{
                        color: '#2d3748',
                        fontWeight: 'bold',
                        backgroundColor: 'transparent',
                        border: 'none',
                        '& .MuiChip-label': {
                            padding: 0
                        }
                    }}
                />
            )
        },
        {
            field: 'title',
            headerName: 'Title',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ fontWeight: 500, color: '#2d3748' }}>
                    {params.row.title}
                </Box>
            ),
        },
        {
            field: 'serviceId',
            headerName: 'Service',
            width: 180,
            valueFormatter: (value) => services.find((s) => s.id === value)?.name || 'Unknown',
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={services.find((s) => s.id === params.row.serviceId)?.name || 'Unknown'}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 3 }}
                />
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <StatusChip status={params.row.status} />
                </Box>
            ),
        },
        {
            field: 'priority',
            headerName: 'Priority',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <PriorityChip priority={params.row.priority} />
                </Box>
            ),
        },
        {
            field: 'assignedTo',
            headerName: 'Assigned To',
            width: 150,
            renderCell: (params: GridRenderCellParams) => {
                const assignee = params.row.assignedTo;
                if (!assignee) {
                    return (
                        <Chip
                            label="Unassigned"
                            variant="outlined"
                            size="small"
                            sx={{ color: '#999' }}
                        />
                    );
                }
                const assigneeName = typeof assignee === 'object' ? assignee.name : assignee;
                return (
                    <Chip
                        label={assigneeName}
                        variant="outlined"
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea'
                        }}
                    />
                );
            },
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            width: 150,
            renderCell: (params: GridRenderCellParams) => {
                try {
                    if (!params.row.createdAt) return <span>N/A</span>;
                    const date = new Date(params.row.createdAt);
                    if (isNaN(date.getTime())) return <span>Invalid Date</span>;

                    return (
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                            {date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </Typography>
                    );
                } catch (error) {
                    console.error('Date rendering error:', error);
                    return <span>Invalid Date</span>;
                }
            },
        },
    ];

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                sx={{
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                }}
            >
                <CircularProgress size={60} sx={{ color: '#667eea' }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            p: 3
        }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <GradientCard sx={{ p: 4, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                                Welcome back, {user?.name || 'User'}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Submit tickets and track their progress
                            </Typography>
                        </Box>
                        <GradientButton
                            onClick={() => setCreateDialogOpen(true)}
                            sx={{
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.3)',
                                }
                            }}
                        >
                            Create Ticket
                        </GradientButton>
                    </Box>
                </GradientCard>

                {/* Stats Cards - Changed to horizontal layout */}
                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                    <StatsCard sx={{ flex: 1 }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                {stats.open}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#718096' }}>
                                Open Tickets
                            </Typography>
                        </CardContent>
                    </StatsCard>

                    <StatsCard sx={{ flex: 1 }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                {stats.inProgress}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#718096' }}>
                                In Progress
                            </Typography>
                        </CardContent>
                    </StatsCard>

                    <StatsCard sx={{ flex: 1 }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                {stats.resolved}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#718096' }}>
                                Resolved
                            </Typography>
                        </CardContent>
                    </StatsCard>

                    <StatsCard sx={{ flex: 1 }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                {stats.closed}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#718096' }}>
                                Closed
                            </Typography>
                        </CardContent>
                    </StatsCard>
                </Box>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2, borderRadius: 3 }}
                    action={
                        <Button color="inherit" size="small" onClick={fetchTickets}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* Tickets Table */}
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Box sx={{ p: 3, background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                        My Tickets ({tickets.length})
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                        Ticket status and priority are managed by our support team
                    </Typography>
                </Box>
                <Box sx={{ height: 500, p: 2 }}>
                    <StyledDataGrid
                        rows={tickets}
                        columns={columns}
                        getRowId={(row) => row.id}
                        pageSizeOptions={[10]}
                        disableRowSelectionOnClick
                        sx={{ border: 'none' }}
                        loading={loading}
                        localeText={{
                            noRowsLabel: tickets.length === 0 && !loading ? 'No tickets found' : 'Loading tickets...'
                        }}
                    />
                </Box>
            </Paper>

            {/* Create Ticket Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        minWidth: 500,
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 600
                }}>
                    Create New Ticket
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2, p: 3 }}>
                    <TextField
                        label="Title"
                        value={newTicket.title}
                        onChange={(e) => setNewTicket((prev) => ({ ...prev, title: e.target.value }))}
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                            }
                        }}
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        value={newTicket.description}
                        onChange={(e) => setNewTicket((prev) => ({ ...prev, description: e.target.value }))}
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                            }
                        }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Service</InputLabel>
                        <Select
                            value={newTicket.serviceId}
                            onChange={(e) => setNewTicket((prev) => ({ ...prev, serviceId: Number(e.target.value) }))}
                            sx={{ borderRadius: 3 }}
                            label="Service"
                        >
                            {services.map((s) => (
                                <MenuItem key={s.id} value={s.id}>
                                    {s.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Removed Priority selection - only admins can set priority */}
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                        Priority level will be assigned by our support team based on the urgency of your request.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setCreateDialogOpen(false)}
                        sx={{ borderRadius: 3 }}
                    >
                        Cancel
                    </Button>
                    <GradientButton onClick={handleCreateTicket}>
                        Submit Ticket
                    </GradientButton>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage(null)}
                message={successMessage}
            />
        </Box>
    );
};

export default ClientDashboard;