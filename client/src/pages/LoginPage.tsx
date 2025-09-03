// src/pages/LoginPage.tsx
import React from "react";
import { Box, Container, Typography, Card, CardContent, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthBackground from "../components/auth/AuthBackground";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <AuthBackground>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            letterSpacing: '0.5px',
                            mb: 1
                        }}
                    >
                        SM SOLUTIONS
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                        Welcome to our Help Desk System
                    </Typography>
                </Box>

                <Card
                    sx={{
                        height: '100%',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6
                        }
                    }}
                >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Client Login
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Access your client dashboard to submit and track support tickets
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/client-login")}
                            fullWidth
                        >
                            Client Login
                        </Button>
                    </CardContent>
                </Card>

                <Card
                    sx={{
                        height: '100%',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6
                        }
                    }}
                >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Staff Login
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Internal staff members access the support administration portal
                        </Typography>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate("/staff-login")}
                            fullWidth
                        >
                            Staff Login
                        </Button>
                    </CardContent>
                </Card>

            </Container>
        </AuthBackground>
    );
};

export default LoginPage;