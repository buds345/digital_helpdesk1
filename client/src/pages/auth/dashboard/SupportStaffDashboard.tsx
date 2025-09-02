import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Alert, Card, CardContent, Button, Chip, DialogContent, DialogActions, Dialog, MenuItem, FormControl, TextField, InputLabel, Select, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Ticket, TicketCreate } from '../../../types/ticket.types';
import { User } from '../../../types/user.types';
import StatusChip from '../../../components/tickets/StatusChip';
import PriorityChip from '../../../components/tickets/PriorityChip';
import AssignTicketButton from '../../../components/tickets/AssignTicketButton';
import { useAuth } from '../../../contexts/AuthContext';
import { createTicket, getStaffTickets } from '../../../api/ticket.api';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';



// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundAttachment: 'fixed',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.15) 0%, transparent 50%)
    `,
        zIndex: 0,
    },
    '& > *': {
        position: 'relative',
        zIndex: 1,
    },
}));

const Header = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '1.2rem 2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
    padding: '4rem 2.5rem 3rem',
    color: 'white',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '4px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
        borderRadius: '2px',
    },
}));

const StatsContainer = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
    maxWidth: '1000px',
}));

const StatCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea, #764ba2)',
    },
    '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
    },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
    fontSize: '3.5rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.8rem',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

const StatLabel = styled(Typography)(({ theme }) => ({
    color: '#555',
    fontSize: '1rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
}));

const TicketsSection = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    padding: '2.5rem',
    margin: '2rem 2.5rem',
    borderRadius: '24px',
    marginTop: 0,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.1)',
}));

const TicketsTable = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const TableHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    padding: '1.5rem 2rem',
    display: 'grid',
    gridTemplateColumns: '100px 2fr 1fr 1fr 1fr 1fr',
    gap: '1.5rem',
    alignItems: 'center',
    borderBottom: '2px solid #e9ecef',
    fontWeight: '700',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.85rem',
}));

const TableRow = styled(Box)(({ theme }) => ({
    padding: '1.5rem 2rem',
    display: 'grid',
    gridTemplateColumns: '100px 2fr 1fr 1fr 1fr 1fr',
    gap: '1.5rem',
    alignItems: 'center',
    borderBottom: '1px solid rgba(241, 243, 244, 0.8)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)',
        transform: 'translateX(4px)',
        boxShadow: 'inset 4px 0 0 #667eea',
    },
    '&:last-child': {
        borderBottom: 'none',
        borderRadius: '0 0 16px 16px',
    },
}));

const CreateTicketButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
    color: 'white',
    borderRadius: '50px',
    padding: '1rem 2.5rem',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontWeight: '600',
    fontSize: '1rem',
    textTransform: 'none',
    letterSpacing: '0.5px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.2) 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
    },
}));

const UserInfo = styled(Typography)(({ theme }) => ({
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: '1rem',
    fontWeight: '500',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
}));

const LogoutButton = styled(Button)(({ theme }) => ({
    color: 'white',
    fontWeight: '600',
    borderRadius: '20px',
    padding: '0.5rem 1.5rem',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-1px)',
    },
}));

const RetryButton = styled(Button)(({ theme }) => ({
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.2)',
    },
}));

const SupportStaffDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newTicket, setNewTicket] = useState<Partial<TicketCreate>>({
        title: '',
        description: '',
        priority: 'medium',
    });

    const fetchData = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Fetching staff tickets...');

            // Use the dedicated staff tickets endpoint with better error handling
            const staffTicketsResponse = await getStaffTickets();
            console.log('Staff tickets response:', staffTicketsResponse);

            // Validate the response is an array with proper typing
            let ticketsData: Ticket[] = [];
            if (Array.isArray(staffTicketsResponse)) {
                ticketsData = staffTicketsResponse as Ticket[];
            } else if (staffTicketsResponse && typeof staffTicketsResponse === 'object' && 'data' in staffTicketsResponse && Array.isArray((staffTicketsResponse as any).data)) {
                ticketsData = (staffTicketsResponse as any).data as Ticket[];
            } else if (staffTicketsResponse && typeof staffTicketsResponse === 'object') {
                console.warn('Unexpected tickets response format:', staffTicketsResponse);
                ticketsData = [];
            }

            setTickets(ticketsData);

            // Fetch users with proper error handling
            try {
                console.log('Fetching users...');
                const usersRes = await axios.get('/users', {
                    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000, // 10 second timeout
                });

                console.log('Users response:', usersRes.data);

                // Handle different response structures for users with proper typing
                let usersData: User[] = [];
                if (Array.isArray(usersRes.data)) {
                    usersData = usersRes.data as User[];
                } else if (usersRes.data && typeof usersRes.data === 'object' && 'data' in usersRes.data && Array.isArray((usersRes.data as any).data)) {
                    usersData = (usersRes.data as any).data as User[];
                }

                setUsers(usersData);
            } catch (usersError) {
                console.warn('Failed to fetch users, continuing without them:', usersError);
                setUsers([]); // Continue without users if they fail to load
            }

        } catch (err: any) {
            console.error('Fetch error:', err);

            // Handle different types of errors
            let errorMessage = 'Failed to fetch data';

            if (err.response) {
                // Server responded with error status
                const status = err.response.status;
                const message = err.response.data?.message || err.response.data?.error || err.message;

                if (status === 401) {
                    errorMessage = 'Session expired. Please login again.';
                    setTimeout(() => logout(), 2000); // Logout after showing error
                } else if (status === 403) {
                    errorMessage = 'Access denied. You may not have permission to view tickets.';
                } else if (status === 404) {
                    errorMessage = 'Tickets endpoint not found. Please contact support.';
                } else if (status === 500) {
                    errorMessage = `Server error (${status}): ${message || 'Internal server error'}`;
                } else {
                    errorMessage = `Error ${status}: ${message}`;
                }
            } else if (err.request) {
                // Request made but no response received
                errorMessage = 'Network error: Unable to connect to server';
            } else if (err.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout: Server took too long to respond';
            } else {
                // Something else happened
                errorMessage = err.message || 'An unexpected error occurred';
            }

            setError(errorMessage);

            // Set empty arrays on error to prevent further issues
            setTickets([]);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    const handleAssignSuccess = async () => {
        await fetchData();
    };

    const handleCreateTicket = async () => {
        if (!newTicket.title?.trim() || !newTicket.description?.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            await createTicket(newTicket as TicketCreate);
            setOpenDialog(false);
            setNewTicket({
                title: '',
                description: '',
                priority: 'medium',
            });
            await fetchData(); // Refresh tickets
            setError(null); // Clear any previous errors
        } catch (err: any) {
            console.error('Create ticket error:', err);

            let errorMessage = 'Failed to create ticket';
            if (err.response?.data?.message) {
                errorMessage += `: ${err.response.data.message}`;
            } else if (err.message) {
                errorMessage += `: ${err.message}`;
            }

            setError(errorMessage);
        }
    };

    const handleRetry = () => {
        fetchData();
    };

    // Calculate stats with safety checks
    const safeTickets = Array.isArray(tickets) ? tickets : [];
    const openTickets = safeTickets.filter(t => t.status === 'open').length;
    const inProgressTickets = safeTickets.filter(t => t.status === 'in_progress').length;
    const resolvedTickets = safeTickets.filter(t => t.status === 'resolved').length;
    const closedTickets = safeTickets.filter(t => t.status === 'closed').length;

    if (loading) return (
        <DashboardContainer>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress sx={{ color: 'white', mb: 2 }} size={60} />
                    <Typography sx={{ color: 'white', opacity: 0.9 }}>
                        Loading dashboard...
                    </Typography>
                </Box>
            </Box>
        </DashboardContainer>
    );

    return (
        <DashboardContainer>
            <Header>
                <Typography variant="h5" sx={{
                    color: 'white',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    SM Solutions Help Desk
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <UserInfo>{user?.name || 'User'} (support)</UserInfo>
                    <LogoutButton variant="outlined" onClick={logout}>
                        Logout
                    </LogoutButton>
                </Box>
            </Header>

            <WelcomeSection>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h2" sx={{
                            fontWeight: '900',
                            marginBottom: 2,
                            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            letterSpacing: '-0.5px'
                        }}>
                            Welcome back, {user?.name || 'Support Staff'}
                        </Typography>
                        <Typography variant="h6" sx={{
                            opacity: 0.95,
                            fontWeight: '400',
                            letterSpacing: '0.5px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            Manage your support tickets effortlessly
                        </Typography>
                    </Box>
                    <CreateTicketButton onClick={() => setOpenDialog(true)}>
                        Create Ticket
                    </CreateTicketButton>
                </Box>

                <StatsContainer>
                    <StatCard>
                        <CardContent sx={{ p: 3 }}>
                            <StatNumber>{openTickets}</StatNumber>
                            <StatLabel>Open</StatLabel>
                        </CardContent>
                    </StatCard>
                    <StatCard>
                        <CardContent sx={{ p: 3 }}>
                            <StatNumber>{inProgressTickets}</StatNumber>
                            <StatLabel>In Progress</StatLabel>
                        </CardContent>
                    </StatCard>
                    <StatCard>
                        <CardContent sx={{ p: 3 }}>
                            <StatNumber>{resolvedTickets}</StatNumber>
                            <StatLabel>Resolved</StatLabel>
                        </CardContent>
                    </StatCard>
                    <StatCard>
                        <CardContent sx={{ p: 3 }}>
                            <StatNumber>{closedTickets}</StatNumber>
                            <StatLabel>Closed</StatLabel>
                        </CardContent>
                    </StatCard>
                </StatsContainer>
            </WelcomeSection>

            <TicketsSection>
                <Typography variant="h4" sx={{
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: 4,
                    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    letterSpacing: '0.5px'
                }}>
                    My Assigned Tickets ({safeTickets.length})
                </Typography>

                {error && (
                    <Alert severity="error" sx={{
                        mb: 3,
                        borderRadius: '16px',
                        background: 'rgba(244, 67, 54, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                        color: 'white',
                        '& .MuiAlert-icon': {
                            color: '#ff6b6b'
                        },
                        '& .MuiAlert-message': {
                            color: 'white'
                        }
                    }}
                        action={
                            <RetryButton size="small" onClick={handleRetry}>
                                Retry
                            </RetryButton>
                        }>
                        {error}
                    </Alert>
                )}

                <TicketsTable>
                    <TableHeader>
                        <Typography variant="subtitle2">Ticket ID</Typography>
                        <Typography variant="subtitle2">Title</Typography>
                        <Typography variant="subtitle2">Service</Typography>
                        <Typography variant="subtitle2">Status</Typography>
                        <Typography variant="subtitle2">Priority</Typography>
                        <Typography variant="subtitle2">Created</Typography>
                    </TableHeader>

                    {safeTickets.length === 0 ? (
                        <Box sx={{
                            p: 6,
                            textAlign: 'center',
                            color: '#888',
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)'
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: '600',
                                mb: 1,
                                color: '#666'
                            }}>
                                {error ? 'Unable to load tickets' : 'No tickets assigned to you'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#999' }}>
                                {error ? 'Please check your connection and try again' : 'You\'ll see your assigned tickets here when they become available'}
                            </Typography>
                        </Box>
                    ) : (
                        safeTickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                                <Typography sx={{
                                    fontWeight: '700',
                                    color: '#667eea',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    #{ticket.id}
                                </Typography>
                                <Typography sx={{
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    {ticket.title || 'Untitled Ticket'}
                                </Typography>
                                <Typography sx={{
                                    color: '#666',
                                    fontWeight: '500',
                                    background: '#f8f9fa',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    textAlign: 'center'
                                }}>
                                    {ticket.service?.name || ticket.serviceType || 'General'}
                                </Typography>
                                <StatusChip status={ticket.status} />
                                <PriorityChip priority={ticket.priority} />
                                <Typography sx={{
                                    color: '#666',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}>
                                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                                </Typography>
                            </TableRow>
                        ))
                    )}
                </TicketsTable>
            </TicketsSection>

            {/* Create Ticket Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Ticket</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Title *"
                            value={newTicket.title || ''}
                            onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description *"
                            value={newTicket.description || ''}
                            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                            multiline
                            rows={4}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={newTicket.priority || 'medium'}
                                label="Priority"
                                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreateTicket}
                        variant="contained"
                        disabled={!newTicket.title?.trim() || !newTicket.description?.trim()}
                    >
                        Create Ticket
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardContainer>
    );
};

export default SupportStaffDashboard;