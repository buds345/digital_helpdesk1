import axios, { AxiosError } from "axios";
import { User, RegisterUserData, LoginCredentials } from "../types/user.types";

const API_BASE_URL = "http://localhost:3001/api";

interface ApiResponse<T> {
    data: T;
    message?: string;
}

interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

function isAxiosError(error: unknown): error is AxiosError<ApiError> {
    return (error as AxiosError).isAxiosError !== undefined;
}

const handleApiError = (error: unknown): never => {
    if (isAxiosError(error)) {
        throw new Error(
            error.response?.data?.message || "An unexpected error occurred"
        );
    }
    throw new Error("An unexpected error occurred");
};

export const userApi = {
    async getUsers(token: string): Promise<User[]> {
        try {
            const response = await axios.get<ApiResponse<User[]>>(
                `${API_BASE_URL}/users`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            return handleApiError(error);
        }
    },

    async register(userData: RegisterUserData): Promise<User> {
        try {
            const response = await axios.post<ApiResponse<User>>(
                `${API_BASE_URL}/auth/register`,
                userData
            );
            return response.data.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        try {
            const response = await axios.post<ApiResponse<{ user: User; token: string }>>(
                `${API_BASE_URL}/auth/login`,
                credentials
            );
            return response.data.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    async getProfile(token: string): Promise<User> {
        try {
            const response = await axios.get<ApiResponse<User>>(
                `${API_BASE_URL}/auth/me`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    async updateUser(userId: string, updates: Partial<User>, token: string): Promise<User> {
        try {
            const response = await axios.patch<ApiResponse<User>>(
                `${API_BASE_URL}/users/${userId}`,
                updates,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    async deleteUser(userId: string, token: string): Promise<void> {
        try {
            await axios.delete(`${API_BASE_URL}/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            return handleApiError(error);
        }
    },
};

export default userApi;