// src/components/NavigateToDashboard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/user.types';

const NavigateToDashboard: React.FC = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    switch (user.role as UserRole) {
        case 'admin':
            return <Navigate to="/admin-dashboard" replace />;
        case 'support':
            return <Navigate to="/support-dashboard" replace />;
        default:
            return <Navigate to="/client-dashboard" replace />;
    }
};

export default NavigateToDashboard;
