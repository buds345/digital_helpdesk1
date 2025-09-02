import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Link, Alert, Box } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import AuthBackground from '../../components/auth/AuthBackground';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [emailNotVerified, setEmailNotVerified] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        setError("");
        setEmailNotVerified(false);

        try {
            const authUser = await login(values.email, values.password);

            // Redirect to role-specific dashboard
            switch (authUser.user.role) {
                case "admin":
                    navigate("/admin-dashboard");
                    break;
                case "support":
                    navigate("/support-dashboard");
                    break;
                default:
                    navigate("/client-dashboard");
                    break;
            }
        } catch (err: any) {
            const errorResponse = err?.response?.data;

            if (errorResponse?.emailNotVerified) {
                setEmailNotVerified(true);
                setUserEmail(errorResponse.email || values.email);
                setError("Your email address has not been verified. Please check your email and click the verification link.");
            } else {
                setError(err?.message || "Login failed");
            }
        }
    };

    const handleResendVerification = () => {
        navigate(`/resend-verification?email=${encodeURIComponent(userEmail)}`);
    };

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
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic' }}
                >

                </Typography>
            </Box>

            <Typography variant="h4" gutterBottom align="center">
                Login
            </Typography>

            {error && (
                <Alert
                    severity={emailNotVerified ? "warning" : "error"}
                    sx={{ mb: 2 }}
                    action={
                        emailNotVerified ? (
                            <Button
                                color="inherit"
                                size="small"
                                onClick={handleResendVerification}
                            >
                                Resend Email
                            </Button>
                        ) : undefined
                    }
                >
                    {error}
                </Alert>
            )}

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
                            label="Email"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            autoComplete="email"
                        />
                        <ErrorMessage name="email" component="div" />

                        <Field
                            as={TextField}
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            autoComplete="current-password"
                        />
                        <ErrorMessage name="password" component="div" />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                Don't have an account?{" "}
                                <Link href="/register" underline="hover">
                                    Register
                                </Link>
                            </Typography>

                            {emailNotVerified && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Need a new verification email?{" "}
                                    <Link
                                        component="button"
                                        type="button"
                                        onClick={handleResendVerification}
                                        underline="hover"
                                    >
                                        Click here
                                    </Link>
                                </Typography>
                            )}
                        </Box>
                    </Form>
                )}
            </Formik>
        </AuthBackground>
    );
};

export default Login;