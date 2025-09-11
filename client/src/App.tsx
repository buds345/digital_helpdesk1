import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Layout from './components/common/Layout';

// ✅ Auth pages
import AdminLogin from './pages/AdminLogin';
import ClientLogin from './pages/ClientLogin';
import Register from './pages/auth/Register';

// ✅ Email verification pages
import EmailVerification from './pages/auth/EmailVerification';
import ResendVerification from './pages/auth/ResendVerification';

// ✅ Forgot Password pages
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// ✅ Dashboards
import ClientDashboard from './pages/auth/dashboard/ClientDashboard';
import AdminDashboard from './pages/auth/dashboard/AdminDashboard';
import SupportStaffDashboard from './pages/auth/dashboard/SupportStaffDashboard';

// ✅ Ticket-related components
import TicketDetail from './components/tickets/TicketDetail';
import CreateTicket from './components/tickets/CreateTicketButton';

// ✅ Context and protected routes
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// 🎨 Theme setup
const theme = createTheme({
    palette: {
        primary: { main: '#4361ee' },
        secondary: { main: '#3f37c9' },
    },
    components: {
        MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
    },
});

const App: React.FC = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public auth routes */}
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/client-login" element={<ClientLogin />} />
                    <Route path="/register" element={<Register />} />

                    {/* Email verification routes */}
                    <Route path="/verify-email" element={<EmailVerification />} />
                    <Route path="/resend-verification" element={<ResendVerification />} />

                    {/* Forgot Password routes */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected routes wrapped with Layout */}
                    <Route element={<Layout />}>
                        {/* Root redirect based on role */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute
                                    render={(user) => (
                                        <Navigate
                                            to={
                                                user.role === 'admin'
                                                    ? '/admin-dashboard'
                                                    : user.role === 'support'
                                                        ? '/support-dashboard'
                                                        : '/client-dashboard'
                                            }
                                            replace
                                        />
                                    )}
                                />
                            }
                        />

                        {/* Dashboards */}
                        <Route
                            path="/client-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['client']}>
                                    <ClientDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin-dashboard"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/support-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['support']}>
                                    <SupportStaffDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Ticket routes */}
                        <Route
                            path="/tickets/:id"
                            element={
                                <ProtectedRoute>
                                    <TicketDetail />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/create-ticket"
                            element={
                                <ProtectedRoute allowedRoles={['client']}>
                                    <CreateTicket />
                                </ProtectedRoute>
                            }
                        />

                        {/* Catch-all fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    </ThemeProvider>
);

export default App;
