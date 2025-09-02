import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { LoginCredentials, User, UserCreate } from '../types/user.types';

// Type for API response
interface AuthResponse {
    user: User;
    token: string;
}

// Type for API error response
interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

// Auth state interface
interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });

    const navigate = useNavigate();

    // Type guard for API errors
    const isApiError = (error: unknown): error is AxiosError<ApiError> => {
        return (error as AxiosError).isAxiosError !== undefined;
    };

    // Helper to extract error message
    const getErrorMessage = (error: unknown, defaultMessage: string): string => {
        if (isApiError(error)) {
            return error.response?.data?.message || defaultMessage;
        }
        if (error instanceof Error) {
            return error.message;
        }
        return defaultMessage;
    };

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user');

                if (token && user) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setAuthState({
                        user: JSON.parse(user),
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } else {
                    setAuthState(prev => ({
                        ...prev,
                        isLoading: false,
                    }));
                }
            } catch (error) {
                const errorMessage = getErrorMessage(error, 'Failed to initialize authentication');
                setAuthState({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: errorMessage,
                });
                console.error('Auth initialization error:', error);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

            const { data } = await axios.post<AuthResponse>('/api/auth/login', credentials);
            const { user, token } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setAuthState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            navigate('/dashboard');
        } catch (error) {
            const errorMessage = getErrorMessage(error, 'Login failed');
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            console.error('Login error:', error);
            throw error;
        }
    }, [navigate]);

    // Registration function
    const register = useCallback(async (userData: UserCreate): Promise<void> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

            const { data } = await axios.post<AuthResponse>('/api/auth/register', userData);
            const { user, token } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setAuthState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            navigate('/dashboard');
        } catch (error) {
            const errorMessage = getErrorMessage(error, 'Registration failed');
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            console.error('Registration error:', error);
            throw error;
        }
    }, [navigate]);

    // Logout function
    const logout = useCallback((): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];

        setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });

        navigate('/login');
    }, [navigate]);

    // Update user function
    const updateUser = useCallback((updatedUser: User): void => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setAuthState(prev => ({
            ...prev,
            user: updatedUser,
        }));
    }, []);

    return {
        ...authState,
        login,
        register,
        logout,
        updateUser,
    };
};

export default useAuth;
