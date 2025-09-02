import React, { createContext, useContext, useState, useEffect } from "react";
import {
    login as apiLogin,
    register as apiRegister,
} from "../api/auth.api";
import {
    User,
    AuthUser,
    RegisterUserData,
    LoginResponse,
    RegisterResponse,
    UserRole
} from "../types/user.types";
import axios from "axios";

interface AuthContextType {
    currentUser: User | null;
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<AuthUser>;
    register: (userData: RegisterUserData) => Promise<RegisterResponse>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // LOGIN - Returns AuthUser for role-based routing
    const login = async (email: string, password: string): Promise<AuthUser> => {
        setError(null);
        setLoading(true);
        try {
            const response: LoginResponse = await apiLogin({ email, password });

            // Convert API response to our internal User type
            const user: User = {
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                role: response.user.role as UserRole,
                status: 'active', // Default status
                emailVerified: response.user.emailVerified,
            };

            const authUser: AuthUser = {
                user: user,
                token: response.token
            };

            // Store token in localStorage
            localStorage.setItem("token", response.token);

            // Set axios default for immediate use
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

            setToken(response.token);
            setUser(user);
            setCurrentUser(user);

            return authUser;
        } catch (err: any) {
            console.error("Login error:", err);
            const backendMessage = err?.response?.data?.message || err?.message || "Login failed";
            setError(backendMessage);
            throw err; // Re-throw to let components handle specific error cases
        } finally {
            setLoading(false);
        }
    };

    // REGISTER - Returns RegisterResponse (no auto-login due to email verification)
    const register = async (userData: RegisterUserData): Promise<RegisterResponse> => {
        setError(null);
        setLoading(true);
        try {
            const apiRole = userData.role as "admin" | "client" | "support";
            const response: RegisterResponse = await apiRegister({ ...userData, role: apiRole });

            // Don't set user/token since email needs to be verified first
            return response;
        } catch (err: any) {
            console.error("Registration error:", err);
            const backendMessage =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.message ||
                "Registration failed";
            setError(backendMessage);
            throw new Error(backendMessage);
        } finally {
            setLoading(false);
        }
    };

    // LOGOUT
    const logout = (): void => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        setCurrentUser(null);
        setError(null);
    };

    // Auto-login on app start if token exists
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                try {
                    setLoading(true);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

                    // You might want to verify the token by calling /me endpoint
                    // const userResponse = await getCurrentUser(storedToken);
                    // setUser(userResponse);
                    // setCurrentUser(userResponse);
                    setToken(storedToken);
                } catch (error) {
                    console.error("Auto-login failed:", error);
                    localStorage.removeItem("token");
                    delete axios.defaults.headers.common['Authorization'];
                } finally {
                    setLoading(false);
                }
            }
        };

        initAuth();
    }, []);

    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                user,
                token,
                login,
                register,
                logout,
                isAuthenticated,
                loading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};