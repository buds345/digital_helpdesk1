import React, { useState, useEffect, ReactNode } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Tabs,
  Tab,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { Ticket, TicketStatus, TicketPriority } from '../../../types/ticket.types';
import { UserRole } from '../../../types/user.types';
import PriorityChip from '../../../components/tickets/PriorityChip';
import { api } from '../../../api/api';

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
  padding: '2rem 3rem',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: '3rem',
  minHeight: 'calc(100vh - 120px)',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  padding: '0.5rem',
  marginBottom: '3rem',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.8)',
  fontWeight: '600',
  fontSize: '1rem',
  borderRadius: '12px',
  margin: '0 0.25rem',
  minHeight: '48px',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&.Mui-selected': {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

const TableContainer = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  overflow: 'hidden',
}));

const TableHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  padding: '1.5rem 2rem',
  display: 'grid',
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
    borderRadius: '0 0 20px 20px',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '0.5rem 1.2rem',
  fontWeight: '600',
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: '2rem',
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
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
  },
}));

// Color-coded Status Chip
const StatusChip = styled(Chip)<{ status: TicketStatus }>(({ status }) => {
  const getStatusColors = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return {
          background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
          color: 'white'
        };
      case 'in_progress':
        return {
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: 'white'
        };
      case 'resolved':
        return {
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white'
        };
      case 'closed':
        return {
          background: 'linear-gradient(135deg, #757575 0%, #424242 100%)',
          color: 'white'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
          color: 'white'
        };
    }
  };

  const colors = getStatusColors(status);
  return {
    background: colors.background,
    color: colors.color,
    fontWeight: '700',
    borderRadius: '12px',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    minWidth: '100px',
  };
});

// Color-coded Priority Chip
const PriorityChipStyled = styled(Chip)<{ priority: TicketPriority }>(({ priority }) => {
  const getPriorityColors = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return {
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white'
        };
      case 'medium':
        return {
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: 'white'
        };
      case 'high':
        return {
          background: 'linear-gradient(135deg, #f44336 0%, #c62828 100%)',
          color: 'white'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: 'white'
        };
    }
  };

  const colors = getPriorityColors(priority);
  return {
    background: colors.background,
    color: colors.color,
    fontWeight: '700',
    borderRadius: '12px',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    minWidth: '80px',
  };
});

interface User {
  email: ReactNode;
  role: string;
  status: string;
  id: number;
  name: string;
}

interface AssignTicketButtonProps {
  ticketId: number;
  users: User[];
  currentAssignee?: User | null;
  onAssignSuccess: () => void;
}

const AssignTicketButton: React.FC<AssignTicketButtonProps> = ({
  ticketId,
  users,
  currentAssignee,
  onAssignSuccess,
}) => {
  const getCurrentAssigneeId = (): number | "" => {
    if (!currentAssignee) return "";
    if (typeof currentAssignee === 'object') {
      return currentAssignee.id || "";
    }
    return currentAssignee || "";
  };

  const [selectedUser, setSelectedUser] = useState<number | "">(getCurrentAssigneeId());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedUser(getCurrentAssigneeId());
  }, [currentAssignee]);

  const handleAssign = async () => {
    setLoading(true);
    try {
      await api.patch(`/tickets/${ticketId}/assign`, {
        userId: selectedUser === "" ? null : selectedUser
      });
      onAssignSuccess();
    } catch (err: any) {
      console.error("Failed to assign ticket:", err);
      alert(err.response?.data?.message || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Select<number | "">
        value={selectedUser}
        onChange={(e) => {
          const value = e.target.value as number | "";
          setSelectedUser(value);
        }}
        size="small"
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">Unassign</MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAssign}
        disabled={loading}
        size="small"
      >
        {loading ? "..." : "Save"}
      </Button>
    </Box>
  );
};

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'tickets' | 'users'>('tickets');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [assignedToFilter, setAssignedToFilter] = useState<number | 'all' | 'unassigned'>('all');

  // Helper function to get the creator's name
  const getCreatorName = (createdBy: any): string => {
    if (!createdBy) return 'Unknown';

    // If createdBy is an object with user information
    if (typeof createdBy === 'object') {
      return createdBy.name || createdBy.username || createdBy.email || 'Unknown';
    }

    // If createdBy is a string (name or email)
    if (typeof createdBy === 'string') {
      return createdBy;
    }

    // If createdBy is a number (user ID), try to find the user
    if (typeof createdBy === 'number') {
      const user = users.find(u => u.id === createdBy);
      return user ? user.name : `User #${createdBy}`;
    }

    return 'Unknown';
  };

  // Fetch tickets and users
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const [ticketsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:3001/api/tickets', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3001/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTickets(Array.isArray(ticketsRes.data) ? ticketsRes.data : ticketsRes.data.data || []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Only support staff for ticket assignment
  const supportStaffUsers = users.filter((u) => u.role === 'support');

  // Refresh tickets after assignment or updates
  const handleAssignSuccess = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const updatedTickets = await axios.get('http://localhost:3001/api/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(
        Array.isArray(updatedTickets.data) ? updatedTickets.data : updatedTickets.data.data || []
      );
    } catch (err: any) {
      setError('Failed to refresh tickets');
      console.error(err);
    }
  };

  // Filter tickets based on status and assignee
  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch = statusFilter === 'all' || ticket.status === statusFilter;
    const assignedId = ticket.assignedTo ?? null;
    const assignedMatch =
      assignedToFilter === 'all' ||
      (assignedToFilter === 'unassigned' ? !assignedId : assignedId === assignedToFilter);
    return statusMatch && assignedMatch;
  });

  // --- Users management ---
  const handleEditUser = (user: User) => {
    setEditUser(user);
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editUser) return;
    try {
      const token = localStorage.getItem('token') || '';
      await axios.put(`http://localhost:3001/api/users/${editUser.id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.map((u) => (u.id === editUser.id ? editUser : u)));
      setEditDialogOpen(false);
      setSuccess('User updated successfully');
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;

    try {
      const token = localStorage.getItem('token') || '';
      await axios.delete(`http://localhost:3001/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => Number(u.id) !== id));
      setSuccess('User deactivated successfully');
    } catch (error) {
      console.error("Error deactivating user:", error);
      setError('Failed to deactivate user');
    }
  };

  // --- Ticket management ---
  const handleChangeTicketStatus = async (ticketId: number, status: TicketStatus) => {
    try {
      const token = localStorage.getItem('token') || '';

      // Update ticket status
      await axios.put(
        `http://localhost:3001/api/tickets/${ticketId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh tickets to reflect changes
      await handleAssignSuccess();

      setSuccess(`Ticket #${ticketId} status updated to ${status.replace('_', ' ')}`);

      // Optional: Send email notification
      console.log(`Email notification sent for ticket #${ticketId} with status ${status}`);
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setError('Failed to update ticket status');
    }
  };

  // Handle priority change (Admin only)
  const handleChangePriority = async (ticketId: number, priority: TicketPriority) => {
    try {
      const token = localStorage.getItem('token') || '';

      // Update ticket priority
      await axios.put(
        `http://localhost:3001/api/tickets/${ticketId}`,
        { priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh tickets to reflect changes
      await handleAssignSuccess();

      setSuccess(`Ticket #${ticketId} priority updated to ${priority}`);
    } catch (err) {
      console.error('Error updating ticket priority:', err);
      setError('Failed to update ticket priority');
    }
  };

  // Calculate stats
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading)
    return (
      <DashboardContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress sx={{ color: 'white', size: 60 }} />
        </Box>
      </DashboardContainer>
    );

  return (
    <DashboardContainer>
      <Header>
        <Typography variant="h3" sx={{
          color: 'white',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 8px rgba(0,0,0,0.1)',
          letterSpacing: '-1px'
        }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" sx={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: '400',
          marginTop: 1,
          letterSpacing: '0.5px'
        }}>
          Manage tickets, priorities, and users with comprehensive controls
        </Typography>
      </Header>

      <ContentContainer>
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
            }
          }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{
            mb: 3,
            borderRadius: '16px',
            background: 'rgba(76, 175, 80, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: '#4caf50'
            }
          }}>
            {success}
          </Alert>
        )}

        {/* Stats Cards */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 3,
          mb: 4
        }}>
          <StatsCard>
            <Typography variant="h3" sx={{
              fontWeight: '900',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              {totalTickets}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', fontWeight: '600' }}>
              Total Tickets
            </Typography>
          </StatsCard>
          <StatsCard>
            <Typography variant="h3" sx={{
              fontWeight: '900',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              {openTickets}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', fontWeight: '600' }}>
              Open Tickets
            </Typography>
          </StatsCard>
          <StatsCard>
            <Typography variant="h3" sx={{
              fontWeight: '900',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              {totalUsers}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', fontWeight: '600' }}>
              Total Users
            </Typography>
          </StatsCard>
          <StatsCard>
            <Typography variant="h3" sx={{
              fontWeight: '900',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              {activeUsers}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', fontWeight: '600' }}>
              Active Users
            </Typography>
          </StatsCard>
        </Box>

        <StyledTabs value={tab} onChange={(e, value) => setTab(value)}>
          <StyledTab label="Tickets Management" value="tickets" />
          <StyledTab label="Users Management" value="users" />
        </StyledTabs>

        {tab === 'tickets' && (
          <TableContainer>
            <TableHeader sx={{ gridTemplateColumns: '80px 2fr 1.5fr 1.5fr 1fr 2fr', gap: '1rem' }}>
              <Typography variant="subtitle2">ID</Typography>
              <Typography variant="subtitle2">Title</Typography>
              <Typography variant="subtitle2">Status</Typography>
              <Typography variant="subtitle2">Priority</Typography>
              <Typography variant="subtitle2">Created By</Typography>
              <Typography variant="subtitle2">Assigned To</Typography>
            </TableHeader>

            {filteredTickets.length === 0 ? (
              <Box sx={{
                p: 6,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#666' }}>
                  No tickets found
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  Tickets will appear here when they are created
                </Typography>
              </Box>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} sx={{ gridTemplateColumns: '80px 2fr 1.5fr 1.5fr 1fr 2fr', gap: '1rem' }}>
                  <Typography sx={{
                    fontWeight: '700',
                    color: '#667eea',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    #{ticket.id}
                  </Typography>
                  <Typography sx={{ fontWeight: '600', color: '#333' }}>
                    {ticket.title}
                  </Typography>

                  {/* Color-coded Status Display with Select */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <StatusChip
                      status={ticket.status}
                      label={ticket.status.replace('_', ' ')}
                    />
                    <Select
                      value={ticket.status}
                      onChange={(e) => handleChangeTicketStatus(ticket.id, e.target.value as TicketStatus)}
                      size="small"
                      sx={{
                        minWidth: 120,
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(102, 126, 234, 0.3)',
                        },
                      }}
                    >
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </Box>

                  {/* Color-coded Priority Display with Select */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <PriorityChipStyled
                      priority={ticket.priority}
                      label={ticket.priority}
                    />
                    <Select
                      value={ticket.priority}
                      onChange={(e) => handleChangePriority(ticket.id, e.target.value as TicketPriority)}
                      size="small"
                      sx={{
                        minWidth: 100,
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(102, 126, 234, 0.3)',
                        },
                      }}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </Box>

                  {/* Fixed Created By Display */}
                  <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                    {getCreatorName(ticket.createdBy)}
                  </Typography>

                  {/* Assignment Control */}
                  <AssignTicketButton
                    ticketId={ticket.id}
                    users={supportStaffUsers}
                    currentAssignee={
                      typeof ticket.assignedTo === 'object' && ticket.assignedTo !== null
                        ? (ticket.assignedTo as User)
                        : ticket.assignedTo
                          ? supportStaffUsers.find((u) => u.id === ticket.assignedTo) || null
                          : null
                    }
                    onAssignSuccess={handleAssignSuccess}
                  />
                </TableRow>
              ))
            )}
          </TableContainer>
        )}

        {tab === 'users' && (
          <TableContainer>
            <TableHeader sx={{ gridTemplateColumns: '80px 1fr 2fr 1fr 1fr 2fr' }}>
              <Typography variant="subtitle2">ID</Typography>
              <Typography variant="subtitle2">Name</Typography>
              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="subtitle2">Role</Typography>
              <Typography variant="subtitle2">Status</Typography>
              <Typography variant="subtitle2">Actions</Typography>
            </TableHeader>

            {users.length === 0 ? (
              <Box sx={{
                p: 6,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#666' }}>
                  No users found
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  Users will appear here when they are registered
                </Typography>
              </Box>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} sx={{ gridTemplateColumns: '80px 1fr 2fr 1fr 1fr 2fr' }}>
                  <Typography sx={{
                    fontWeight: '700',
                    color: '#667eea',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    #{user.id}
                  </Typography>
                  <Typography sx={{ fontWeight: '600', color: '#333' }}>
                    {user.name}
                  </Typography>
                  <Typography sx={{ color: '#666' }}>
                    {user.email}
                  </Typography>
                  <Chip
                    label={user.role}
                    sx={{
                      background: user.role === 'admin' ? '#e3f2fd' : user.role === 'support' ? '#f3e5f5' : '#e8f5e8',
                      color: user.role === 'admin' ? '#1976d2' : user.role === 'support' ? '#7b1fa2' : '#388e3c',
                      fontWeight: '600'
                    }}
                  />
                  <Chip
                    label={user.status || 'active'}
                    sx={{
                      background: user.status === 'active' ? '#e8f5e8' : '#ffebee',
                      color: user.status === 'active' ? '#388e3c' : '#d32f2f',
                      fontWeight: '600'
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <ActionButton
                      variant="contained"
                      size="small"
                      onClick={() => handleEditUser(user)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      }}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteUser(Number(user.id))}
                    >
                      Deactivate
                    </ActionButton>
                  </Box>
                </TableRow>
              ))
            )}
          </TableContainer>
        )}

        {/* Edit User Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          <DialogTitle sx={{
            fontWeight: '700',
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Edit User
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1, p: 3 }}>
            <TextField
              label="Name"
              value={editUser?.name || ''}
              onChange={(e) =>
                setEditUser((prev) => (prev ? { ...prev, name: e.target.value } : null))
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
            <TextField
              label="Email"
              value={editUser?.email || ''}
              onChange={(e) =>
                setEditUser((prev) => (prev ? { ...prev, email: e.target.value } : null))
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
            <FormControl>
              <InputLabel>Role</InputLabel>
              <Select
                value={editUser?.role || ''}
                onChange={(e) =>
                  setEditUser((prev) =>
                    prev ? { ...prev, role: e.target.value as UserRole } : null
                  )
                }
                sx={{
                  borderRadius: '12px',
                }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="support">Support Staff</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                value={editUser?.status || 'active'}
                onChange={(e) =>
                  setEditUser((prev) =>
                    prev ? { ...prev, status: e.target.value } : null
                  )
                }
                sx={{
                  borderRadius: '12px',
                }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <ActionButton onClick={() => setEditDialogOpen(false)}>
              Cancel
            </ActionButton>
            <ActionButton
              variant="contained"
              onClick={handleSaveUser}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              Save Changes
            </ActionButton>
          </DialogActions>
        </Dialog>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default AdminDashboard;