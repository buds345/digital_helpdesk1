export type UserRole =
    | 'client'
    | 'support'
    | 'admin'
    | 'project_manager'
    | 'finance';

export interface User {
    id: number;
    email: string;
    password?: string; // Only for internal use, never returned in API responses
    name: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserCreate {
    email: string;
    password: string;
    name: string;
    role: UserRole;
}

export interface UserUpdate {
    email?: string;
    name?: string;
    role?: UserRole;
    password?: string;
}

export interface AuthUser {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    token: string;
    newPassword: string;
}