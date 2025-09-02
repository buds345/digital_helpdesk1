import axios from 'axios';
import { Ticket, TicketCreate } from '../types/ticket.types';

// Create a reusable axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  //withCredentials: true
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
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Ticket API functions
export const createTicket = async (ticketData: TicketCreate): Promise<Ticket> => {
  const { data } = await api.post('/tickets', ticketData);
  return data;
};

export const getTickets = async (): Promise<Ticket[]> => {
  const { data } = await api.get('/tickets');
  return data;
};

export const getTicket = async (ticketId: string): Promise<Ticket> => {
  const { data } = await api.get(`/tickets/${ticketId}`);
  return data;
};

export const updateTicket = async (ticketId: string, updateData: Partial<Ticket>): Promise<Ticket> => {
  const { data } = await api.put(`/tickets/${ticketId}`, updateData);
  return data;
};

export const assignTicket = async (ticketId: string, userId: number | null): Promise<Ticket> => {
  const { data } = await api.patch(`/tickets/${ticketId}/assign`, {
    userId: userId // Use userId instead of assigneeId to match backend
  });
  return data;
};

export const addTicketUpdate = async (
  ticketId: string,
  update: { message: string; status?: string }
): Promise<any> => {
  const { data } = await api.post(`/tickets/${ticketId}/updates`, update);
  return data;
};

export const uploadAttachment = async (ticketId: string, file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post(`/tickets/${ticketId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteTicket = async (ticketId: string): Promise<void> => {
  await api.delete(`/tickets/${ticketId}`);
};

// Export the axios instance for other uses
export { api };