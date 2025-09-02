import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { User } from '../../types/user.types';
import { assignTicket } from '../../api/ticket.api';
import { useAuth } from '../../contexts/AuthContext';

interface AssignTicketButtonProps {
  ticketId: string;
  users: User[];
  currentAssignee?: string | null;
  onAssignSuccess?: () => void;
}

const AssignTicketButton: React.FC<AssignTicketButtonProps> = ({
  ticketId,
  users,
  currentAssignee,
  onAssignSuccess
}) => {
  const { token } = useAuth(); // Get token from auth context (could be string | null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setError(null);
  };

  const handleAssign = async (userId: string | null) => {
    // Check if token is available
    if (!token) {
      setError('Authentication token is missing. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await assignTicket(ticketId, userId ? parseInt(userId) : null, token);

      // Show success message with email notification status
      const assignedUser = userId ? users.find(u => u.id.toString() === userId) : null;
      let message = '';

      if (userId) {
        message = `Ticket assigned to ${assignedUser?.name || 'staff member'}`;
        if (response.emailSent) {
          message += '. Email notification sent! 📧';
        } else {
          message += '. (Email notification failed to send)';
        }
      } else {
        message = 'Ticket unassigned successfully';
      }

      setSuccessMessage(message);
      setShowSnackbar(true);
      onAssignSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to assign ticket');
      console.error('Assignment error:', err);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const getAssigneeName = () => {
    if (!currentAssignee) return 'Unassigned';
    const user = users.find(u => u.id.toString() === currentAssignee);
    return user ? user.name : 'Unknown';
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
    setSuccessMessage(null);
  };

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleClick}
        disabled={loading || !token}
        startIcon={loading ? <CircularProgress size={20} /> : undefined}
      >
        {loading ? 'Assigning...' : getAssigneeName()}
      </Button>

      {!token && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          No authentication token available
        </Typography>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'assign-button',
        }}
      >
        <MenuItem onClick={() => handleAssign(null)}>
          Unassign Ticket
        </MenuItem>
        {users
          .filter(user => user.role === 'support') // Only show support staff
          .map(user => (
            <MenuItem
              key={user.id}
              onClick={() => handleAssign(user.id.toString())}
              selected={user.id.toString() === currentAssignee}
            >
              {user.name}
            </MenuItem>
          ))}
      </Menu>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignTicketButton;