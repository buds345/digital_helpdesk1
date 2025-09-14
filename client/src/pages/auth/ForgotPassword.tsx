import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Typography,
    TextField,
    Button,
    Link,
    Alert,
    Box,
    Paper,
    CircularProgress
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import AuthBackground from '../../components/auth/AuthBackground';
import logo from '../../assets/images/logo.png'; // ✅ Correct import


const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const { forgotPassword } = useAuth();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const initialValues = {
        email: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        setError("");
        setSuccess(false);

        try {
            const response = await forgotPassword(values.email);
            setSuccess(true);
            setEmailSent(response.emailSent);
        } catch (err: any) {
            setError(err?.message || "Failed to send reset email");
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <AuthBackground>
            {/* Company Logo */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <img
                    src={logo} // ✅ Use imported logo
                    alt="Company Logo"
                    style={{
                        maxWidth: '200px',
                        height: 'auto',
                        marginBottom: '16px',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                    }}
                />
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
                Forgot Password
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
            >
                Enter your email address and we'll send you a link to reset your password.
            </Typography>

            {success && !error && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {emailSent
                        ? "Password reset email sent successfully! Please check your email inbox and follow the instructions to reset your password."
                        : "Password reset request processed. If an account with this email exists, you will receive reset instructions."
                    }
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!success && (
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values }) => (
                        <Form>
                            <Field
                                as={TextField}
                                name="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                autoComplete="email"
                                autoFocus
                                disabled={isSubmitting}
                                sx={{ mb: 2 }}
                            />
                            <ErrorMessage name="email">
                                {msg => (
                                    <Typography variant="body2" color="error" sx={{ mt: 0.5, mb: 1 }}>
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
                                sx={{ mt: 2, py: 1.5 }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                        Sending Reset Email...
                                    </>
                                ) : (
                                    "Send Reset Email"
                                )}
                            </Button>
                        </Form>
                    )}
                </Formik>
            )}

            {success && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleBackToLogin}
                        fullWidth
                        sx={{ py: 1.5 }}
                    >
                        Back to Login
                    </Button>
                </Box>
            )}

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2">
                    Remember your password?{" "}
                    <Link
                        component={RouterLink}
                        to="/login"
                        underline="hover"
                        sx={{ fontWeight: 'medium' }}
                    >
                        Sign In
                    </Link>
                </Typography>
            </Box>
        </AuthBackground>
    );
};

export default ForgotPassword;