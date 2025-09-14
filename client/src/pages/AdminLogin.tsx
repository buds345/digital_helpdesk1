import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Link, Alert, Box } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import AuthBackground from '../components/auth/AuthBackground';
import logo from '../assets/images/logo.png'; // ✅ Correct import

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState("");

    const initialValues = {
        email: "",
        password: ""
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        setError("");
        try {
            const authUser = await login(values.email, values.password);

            // Allow only admin or support
            if (authUser.user.role === "admin") {
                navigate("/admin-dashboard");
            } else if (authUser.user.role === "support") {
                navigate("/support-dashboard");
            } else {
                setError("Unauthorized: This login is for staff only.");
            }
        } catch (err: any) {
            setError(err?.message || "Login failed");
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    const handleRegister = () => {
        navigate("/register");
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
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic' }}
                >

                </Typography>
            </Box>

            <Typography variant="h4" gutterBottom align="center">
                Staff Login
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
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

                        <Box sx={{ textAlign: 'right', mb: 2 }}>
                            <Link
                                component="button"
                                type="button"
                                onClick={handleForgotPassword}
                                underline="hover"
                                variant="body2"
                                sx={{ color: 'primary.main' }}
                            >
                                Forgot Password?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                Don't have an account?{" "}
                                <Link
                                    component="button"
                                    type="button"
                                    onClick={handleRegister}
                                    underline="hover"
                                    sx={{ color: 'primary.main' }}
                                >
                                    Register
                                </Link>
                            </Typography>
                        </Box>
                    </Form>
                )}
            </Formik>
        </AuthBackground>
    );
};

export default AdminLogin;