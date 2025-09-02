import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3001/api/auth",
});

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: "admin" | "client" | "support";
}

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

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await API.post("/login", credentials);

    if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
    }

    return response.data;
};

export const register = async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await API.post("/register", data);
    return response.data;
};

export const verifyEmail = async (token: string): Promise<VerificationResponse> => {
    const response = await API.post("/verify-email", { token });
    return response.data;
};

export const resendVerificationEmail = async (email: string): Promise<{ message: string; emailSent: boolean }> => {
    const response = await API.post("/resend-verification", { email });
    return response.data;
};

export const getCurrentUser = async (token?: string) => {
    const authToken = token || localStorage.getItem("token");
    if (!authToken) throw new Error("No token found");

    const response = await API.get("/me", {
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return response.data;
};

export const logout = async () => {
    localStorage.removeItem("token");
    return { message: "Logged out" };
};