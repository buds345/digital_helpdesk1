import axios from 'axios';
import { Ticket, TicketCreate, TicketUpdate, TicketPriority, TicketStatus } from '../types/ticket.types';

// Create a reusable axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => {
        console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Helper function to handle different response formats
const handleResponse = (response: any): any => {
    if (Array.isArray(response.data)) {
        return response.data;
    } else if (response.data && typeof response.data === 'object') {
        return response.data.data || response.data;
    }
    return response.data;
};

// Ticket API functions with proper typing
export const createTicket = async (ticketData: TicketCreate): Promise<Ticket> => {
    try {
        const { data } = await api.post('/tickets', ticketData);
        return handleResponse({ data });
    } catch (error: any) {
        console.error('Create ticket error:', error);
        throw new Error(error.response?.data?.message || 'Failed to create ticket');
    }
};

export const getTickets = async (): Promise<Ticket[]> => {
    try {
        const { data } = await api.get('/tickets');
        const responseData = handleResponse({ data });
        return Array.isArray(responseData) ? responseData : [];
    } catch (error: any) {
        console.error('Get tickets error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch tickets');
    }
};

export const getStaffTickets = async (): Promise<Ticket[]> => {
    try {
        const { data } = await api.get('/tickets/staff');
        const responseData = handleResponse({ data });
        return Array.isArray(responseData) ? responseData : [];
    } catch (error: any) {
        console.error('Get staff tickets error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch staff tickets');
    }
};

export const getTicket = async (ticketId: string): Promise<Ticket> => {
    try {
        const { data } = await api.get(`/tickets/${ticketId}`);
        return handleResponse({ data });
    } catch (error: any) {
        console.error(`Get ticket ${ticketId} error:`, error);
        if (error.response?.status === 404) {
            throw new Error('Ticket not found');
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch ticket');
    }
};

export const updateTicket = async (ticketId: string, updateData: TicketUpdate): Promise<Ticket> => {
    try {
        const { data } = await api.patch(`/tickets/${ticketId}`, updateData);
        return handleResponse({ data });
    } catch (error: any) {
        if (error.response?.status === 404 || error.response?.status === 405) {
            try {
                const { data } = await api.put(`/tickets/${ticketId}`, updateData);
                return handleResponse({ data });
            } catch (putError: any) {
                console.error(`Update ticket ${ticketId} error:`, putError);
                throw new Error(putError.response?.data?.message || 'Failed to update ticket');
            }
        }
        console.error(`Update ticket ${ticketId} error:`, error);
        throw new Error(error.response?.data?.message || 'Failed to update ticket');
    }
};

// Specific function for priority updates
export const updateTicketPriority = async (ticketId: string, priority: TicketPriority): Promise<Ticket> => {
    return updateTicket(ticketId, { priority });
};

// Specific function for status updates
export const updateTicketStatus = async (ticketId: string, status: TicketStatus): Promise<Ticket> => {
    return updateTicket(ticketId, { status });
};

// Specific function for assignment updates
export const updateTicketAssignment = async (ticketId: string, assignedTo: number | null): Promise<Ticket> => {
    return updateTicket(ticketId, { assignedTo });
};

// Assign ticket function with proper typing
export const assignTicket = async (
    ticketId: string, userId: number | null, token: string): Promise<Ticket> => {
    try {
        const { data } = await api.patch(
            `/tickets/${ticketId}/assign`,
            { userId }
        );
        return handleResponse({ data });
    } catch (error: any) {
        console.error(`Assign ticket ${ticketId} error:`, error);

        if (error.response?.status === 404) {
            try {
                return await updateTicketAssignment(ticketId, userId);
            } catch (updateError: any) {
                throw new Error(updateError.response?.data?.message || 'Failed to assign ticket');
            }
        }

        throw new Error(error.response?.data?.message || 'Failed to assign ticket');
    }
};

export const addTicketUpdate = async (
    ticketId: string,
    update: { message: string; status?: TicketStatus }
): Promise<any> => {
    try {
        const { data } = await api.post(`/tickets/${ticketId}/updates`, update);
        return handleResponse({ data });
    } catch (error: any) {
        console.error(`Add update to ticket ${ticketId} error:`, error);
        throw new Error(error.response?.data?.message || 'Failed to add update');
    }
};

export const uploadAttachment = async (ticketId: string, file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post(`/tickets/${ticketId}/attachments`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return handleResponse({ data });
    } catch (error: any) {
        console.error(`Upload attachment to ticket ${ticketId} error:`, error);
        throw new Error(error.response?.data?.message || 'Failed to upload attachment');
    }
};

export const deleteTicket = async (ticketId: string): Promise<void> => {
    try {
        await api.delete(`/tickets/${ticketId}`);
    } catch (error: any) {
        console.error(`Delete ticket ${ticketId} error:`, error);
        throw new Error(error.response?.data?.message || 'Failed to delete ticket');
    }
};

// Additional utility functions
export const getTicketsByStatus = async (status: TicketStatus): Promise<Ticket[]> => {
    try {
        const { data } = await api.get(`/tickets?status=${status}`);
        const responseData = handleResponse({ data });
        return Array.isArray(responseData) ? responseData : [];
    } catch (error: any) {
        console.error(`Get tickets by status ${status} error:`, error);
        throw new Error(error.response?.data?.message || 'Failed to fetch tickets by status');
    }
};

export const getTicketsByUser = async (userId: number): Promise<Ticket[]> => {
    try {
        const { data } = await api.get(`/tickets?userId=${userId}`);
        const responseData = handleResponse({ data });
        return Array.isArray(responseData) ? responseData : [];
    } catch (error: any) {
        console.error(`Get tickets by user ${userId} error:`, error);
        throw new Error(error.response?.data?.message || 'Failed to fetch user tickets');
    }
};

// Get tickets by priority
export const getTicketsByPriority = async (priority: TicketPriority): Promise<Ticket[]> => {
    try {
        const { data } = await api.get(`/tickets?priority=${priority}`);
        const responseData = handleResponse({ data });
        return Array.isArray(responseData) ? responseData : [];
    } catch (error: any) {
        console.error(`Get tickets by priority ${priority} error:`, error);
        throw new Error(error.response?.data?.message || 'Failed to fetch tickets by priority');
    }
};

// Debug function to test API connectivity
export const testAPIConnection = async (): Promise<boolean> => {
    try {
        await api.get('/health');
        return true;
    } catch (error) {
        console.error('API connection test failed:', error);
        return false;
    }
};

// Export the axios instance for other uses
export { api };