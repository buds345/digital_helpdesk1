export type UserRole = "admin" | "client" | "support";

export interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: string; // Keep this for backward compatibility
    emailVerified: boolean; // Add email verification field
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthUser {
    user: User;
    token: string;
}

export interface UserCreate {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'client' | 'support';
}

// API Response types
export interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
    };
}

export interface RegisterResponse {
    message: string;
    emailSent: boolean;
}

export interface VerificationResponse {
    message: string;
    verified: boolean;
}

export interface LoginError {
    message: string;
    emailNotVerified?: boolean;
    email?: string;
}