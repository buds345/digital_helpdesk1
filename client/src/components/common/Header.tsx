import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/">
                        Digital Help Desk
                    </Button>
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    {user ? (
                        <>
                            <Button color="inherit" component={Link} to="/dashboard">
                                Dashboard
                            </Button>
                            <Button color="inherit" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;