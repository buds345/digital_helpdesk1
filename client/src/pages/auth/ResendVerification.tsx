// src/pages/auth/ResendVerification.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography, TextField, Button, Alert, Box } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { resendVerificationEmail } from "../../api/auth.api";
import AuthBackground from '../../components/auth/AuthBackground';

const ResendVerification: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // Get email from URL params if available
    const emailFromUrl = searchParams.get('email') || '';

    const initialValues = {
        email: emailFromUrl,
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
    });

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        setError("");
        setMessage("");
        setIsSuccess(false);

        try {
            console.log('📧 Attempting to resend verification email to:', values.email);
            const response = await resendVerificationEmail(values.email);
            console.log('✅ Resend successful:', response);
            setMessage(response.message);
            setIsSuccess(true);
        } catch (err: any) {
            console.error('❌ Resend failed:', err);
            setError(err?.response?.data?.message || "Failed to resend verification email");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthBackground>
            <Box maxWidth="400px" mx="auto">
                <Typography variant="h4" gutterBottom align="center">
                    Resend Verification Email
                </Typography>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Enter your email address and we'll send you a new verification link.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {message && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {message}
                    </Alert>
                )}

                {!isSuccess && (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    name="email"
                                    label="Email Address"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                                <ErrorMessage name="email" component="div" />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    fullWidth
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    {isSubmitting ? "Sending..." : "Send Verification Email"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                )}

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                        variant="text"
                        onClick={() => navigate('/login')}
                        sx={{ textDecoration: 'underline' }}
                    >
                        Back to Login
                    </Button>
                </Box>
            </Box>
        </AuthBackground>
    );
};

export default ResendVerification;