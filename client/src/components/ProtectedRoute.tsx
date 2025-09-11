import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface User {
    id: string;
    role: string;
}

interface ProtectedRouteProps {
    children?: React.ReactNode;
    render?: (user: User) => React.ReactNode;
    allowedRoles?: string[];
    adminOnly?: boolean;
    fallback?: React.ReactNode;
    loginPath?: string; // 👈 NEW: custom login redirect
}

const ProtectedRoute = ({
    children,
    render,
    allowedRoles,
    adminOnly,
    fallback = <div>Loading...</div>,
    loginPath = "/client-login" // 👈 Default fallback login
}: ProtectedRouteProps): ReactElement | null => {
    const { user, loading } = useAuth();

    // Handle loading state
    if (loading) {
        return <>{fallback}</>;
    }

    // Redirect if no user
    if (!user) {
        return <Navigate to={loginPath} replace />;
    }

    // Check admin access
    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    // Check role-based access
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Render content
    try {
        if (render) {
            return <>{render(user)}</>;
        }
        return <>{children}</>;
    } catch (error) {
        console.error("ProtectedRoute render error:", error);
        return <Navigate to="/error" replace />;
    }
};

export default ProtectedRoute;
