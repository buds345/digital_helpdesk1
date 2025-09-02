// src/pages/auth/EmailVerification.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Typography, Button, Alert, CircularProgress, Box } from "@mui/material";

import { verifyEmail } from "../../api/auth.api";
import AuthBackground from '../../components/auth/AuthBackground';

const EmailVerification: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get('token');

        console.log('🔍 Verification token from URL:', token);

        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link. No token provided.');
            return;
        }

        const handleVerification = async () => {
            try {
                console.log('📧 Attempting to verify email with token:', token);
                const response = await verifyEmail(token);
                console.log('✅ Verification successful:', response);
                setStatus('success');
                setMessage(response.message);
            } catch (error: any) {
                console.error('❌ Verification failed:', error);
                setStatus('error');
                setMessage(error?.response?.data?.message || 'Verification failed. Please try again.');
            }
        };

        handleVerification();
    }, [searchParams]);

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleResendEmail = () => {
        navigate('/resend-verification');
    };

    return (
        <AuthBackground>
            <Box textAlign="center" maxWidth="500px" mx="auto">
                <Typography variant="h4" gutterBottom>
                    Email Verification
                </Typography>

                {status === 'loading' && (
                    <Box>
                        <CircularProgress size={60} sx={{ mb: 2 }} />
                        <Typography variant="body1">
                            Verifying your email address...
                        </Typography>
                    </Box>
                )}

                {status === 'success' && (
                    <Box>

                        <Alert severity="success" sx={{ mb: 3 }}>
                            {message}
                        </Alert>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Your account has been successfully verified! You can now log in and start using the platform.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleLoginRedirect}
                            fullWidth
                        >
                            Go to Login
                        </Button>
                    </Box>
                )}

                {status === 'error' && (
                    <Box>

                        <Alert severity="error" sx={{ mb: 3 }}>
                            {message}
                        </Alert>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            The verification link may have expired or is invalid.
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleResendEmail}
                                fullWidth
                            >
                                Resend Verification Email
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleLoginRedirect}
                                fullWidth
                            >
                                Back to Login
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </AuthBackground>
    );
};

export default EmailVerification;