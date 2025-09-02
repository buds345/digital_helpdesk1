// src/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api"; // adjust if needed

// Example: login user
export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
};

// Example: register user
export const register = async (name: string, email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
    return response.data;
};

// Example: fetch tickets
export const getTickets = async () => {
    const response = await axios.get(`${API_BASE_URL}/tickets`);
    return response.data;
};

// Example: create ticket
export const createTicket = async (title: string, description: string, userId: number) => {
    const response = await axios.post(`${API_BASE_URL}/tickets`, { title, description, userId });
    return response.data;
};

// Example: add comment
export const addComment = async (ticketId: number, userId: number, content: string) => {
    const response = await axios.post(`${API_BASE_URL}/comments`, { ticketId, userId, content });
    return response.data;
};
