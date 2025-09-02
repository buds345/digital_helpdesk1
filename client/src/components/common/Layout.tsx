import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    useTheme,
    CircularProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
    const { user, logout, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    // ✅ Wait for auth to finish loading
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    // ✅ If not authenticated, redirect to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Top Bar */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    boxShadow: 'none',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>

                    </Typography>
                    <Typography sx={{ mr: 2 }}>

                    </Typography>
                    <Button color="inherit" onClick={logout} sx={{ textTransform: 'none' }}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginTop: '64px', // Push below AppBar
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
