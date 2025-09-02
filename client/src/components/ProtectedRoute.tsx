import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface User {
    id: string;
    role: string;
    // Add other user properties as needed
}

interface ProtectedRouteProps {
    children?: React.ReactNode;
    render?: (user: User) => React.ReactNode;
    allowedRoles?: string[];
    adminOnly?: boolean;
    fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    render,
    allowedRoles,
    adminOnly,
    fallback = null
}) => {
    const { user, loading } = useAuth();

    // Handle loading state
    if (loading) {
        return <>{fallback}</> || <div>Loading...</div>;
    }

    // Redirect if no user
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check admin access
    if (adminOnly && user.role !== 'admin') {
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
        console.error('ProtectedRoute render error:', error);
        return <Navigate to="/error" replace />;
    }
};

export default ProtectedRoute;