import { Request } from 'express';

// Define UserRole type or enum here if not imported from elsewhere
export type UserRole = 'admin' | 'user' | 'support'; // Adjust roles as needed

// Extend Express Request type to include user property


// Generic API response type
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// Pagination parameters
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// File upload type
export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
}