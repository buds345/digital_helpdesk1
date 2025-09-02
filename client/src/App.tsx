import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Layout from './components/common/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// ✅ New email verification pages
import EmailVerification from './pages/auth/EmailVerification';
import ResendVerification from './pages/auth/ResendVerification';

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
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* ✅ Email verification routes */}
                    <Route path="/verify-email" element={<EmailVerification />} />
                    <Route path="/resend-verification" element={<ResendVerification />} />

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
