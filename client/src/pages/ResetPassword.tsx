import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    Typography,
    TextField,
    Button,
    Link,
    Alert,
    Box,
    CircularProgress
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import AuthBackground from '../components/auth/AuthBackground';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const [searchParams] = useSearchParams();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [resetToken, setResetToken] = useState<string | null>(null);

    // Get token from URL parameters
    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setError("Invalid or missing reset token. Please request a new password reset.");
        } else {
            // Send just the token hash, not the full URL
            setResetToken(token);
        }
    }, [searchParams]);

    const initialValues = {
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            )
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required("Please confirm your password"),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        if (!resetToken) {
            setError("Invalid reset token. Please request a new password reset.");
            return;
        }

        setError("");
        setSuccess(false);

        try {
            await resetPassword(resetToken, values.password);
            setSuccess(true);
        } catch (err: any) {
            setError(err?.message || "Failed to reset password");
        }
    };

    const handleBackToLogin = () => {
        navigate("/client-login");
    };

    const handleRequestNewReset = () => {
        navigate("/forgot-password");
    };

    // If no token, show error state
    if (!resetToken && !success) {
        return (
            <AuthBackground>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
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
                </Box>

                <Typography variant="h4" gutterBottom align="center">
                    Invalid Reset Link
                </Typography>

                <Alert severity="error" sx={{ mb: 3 }}>
                    This password reset link is invalid or has expired. Please request a new password reset.
                </Alert>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRequestNewReset}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    Request New Password Reset
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleBackToLogin}
                    fullWidth
                >
                    Back to Login
                </Button>
            </AuthBackground>
        );
    }

    return (
        <AuthBackground>
            {/* Company Title */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
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
            </Box>

            {/* Back to Login Button */}
            <Box sx={{ mb: 2 }}>
                <Button
                    onClick={handleBackToLogin}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                    }}
                >
                    Back to Login
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 1 }}>
                Reset Password
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
            >
                Enter your new password below.
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Password reset successful! You can now log in with your new password.
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success ? (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBackToLogin}
                        fullWidth
                        sx={{ py: 1.5 }}
                    >
                        Go to Login
                    </Button>
                </Box>
            ) : (
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Field
                                as={TextField}
                                name="password"
                                label="New Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                autoComplete="new-password"
                                disabled={isSubmitting}
                            />
                            <ErrorMessage name="password">
                                {msg => (
                                    <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                                        {msg}
                                    </Typography>
                                )}
                            </ErrorMessage>

                            <Field
                                as={TextField}
                                name="confirmPassword"
                                label="Confirm New Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                autoComplete="new-password"
                                disabled={isSubmitting}
                                sx={{ mt: 2 }}
                            />
                            <ErrorMessage name="confirmPassword">
                                {msg => (
                                    <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                                        {msg}
                                    </Typography>
                                )}
                            </ErrorMessage>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                fullWidth
                                sx={{ mt: 3, py: 1.5 }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                        Resetting Password...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </Form>
                    )}
                </Formik>
            )}
        </AuthBackground>
    );
};

export default ResetPassword;