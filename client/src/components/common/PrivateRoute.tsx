export { }; // Add this at the top of the file
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
    children: React.ReactElement;
    roles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;