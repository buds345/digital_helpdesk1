import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Link, MenuItem, Alert, Box } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/user.types";
import AuthBackground from '../../components/auth/AuthBackground';


const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const initialValues = {
        name: "",
        email: "",
        password: "",
        role: "client" as UserRole,
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
        role: Yup.string()
            .oneOf(["client", "support", "admin"])
            .required("Required"),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        setError("");
        try {
            // register now returns RegisterResponse, not AuthUser
            const response = await register({ ...values, role: values.role as UserRole });
            setUserEmail(values.email);
            setIsRegistered(true);

            // No automatic login - user needs to verify email first
        } catch (err: any) {
            setError(err?.message || "Registration failed");
        }
    };

    const handleGoToLogin = () => {
        navigate("/client-login");
    };

    const handleResendEmail = () => {
        navigate(`/resend-verification?email=${encodeURIComponent(userEmail)}`);
    };

    if (isRegistered) {
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
                        ICT Service Desk
                    </Typography>
                </Box>

                <Box textAlign="center" maxWidth="500px" mx="auto">
                    <Typography variant="h4" gutterBottom>
                        Registration Successful!
                    </Typography>

                    <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Check your email!</strong>
                        </Typography>
                        <Typography variant="body2">
                            We've sent a verification email to <strong>{userEmail}</strong>.
                            Please click the verification link in your email to activate your account.
                        </Typography>
                    </Alert>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        You'll need to verify your email address before you can log in to your account.
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGoToLogin}
                            fullWidth
                        >
                            Go to Login
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleResendEmail}
                            fullWidth
                        >
                            Resend Verification Email
                        </Button>
                    </Box>
                </Box>
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
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic' }}
                >

                </Typography>
            </Box>

            <Typography variant="h4" gutterBottom align="center">
                Register
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
                {({ isSubmitting, values }) => (
                    <Form>
                        <Field
                            as={TextField}
                            name="name"
                            label="Full Name"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <ErrorMessage name="name" component="div" />

                        <Field
                            as={TextField}
                            name="email"
                            label="Email"
                            fullWidth
                            margin="normal"
                            variant="outlined"
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
                        />
                        <ErrorMessage name="password" component="div" />

                        <Field
                            as={TextField}
                            name="role"
                            label="Role"
                            select
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={values.role}
                        >
                            <MenuItem value="client">Client</MenuItem>
                            <MenuItem value="support">Support Staff</MenuItem>

                        </Field>
                        <ErrorMessage name="role" component="div" />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>

                        <Typography sx={{ mt: 2 }} align="center">
                            Already have an account?{" "}
                            <Link href="/client-login" underline="hover">
                                Login
                            </Link>
                        </Typography>
                    </Form>
                )}
            </Formik>
        </AuthBackground>
    );
};

export default Register;