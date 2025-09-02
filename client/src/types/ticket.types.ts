// src/types/ticket.types.ts


export type TicketStatus = 'open' | 'in_progress' | 'waiting_on_client' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
    emailSent: any;
    serviceId: any;
    createdBy: boolean;
    serviceType: string;
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    service: {
        id: number;
        name: string;
    };
    clientId: number;
    // updated to allow null because some tickets may be unassigned
    assignedTo?: number | null;
    createdAt: string;
    updatedAt?: string;
}

// For creating a new ticket
export interface TicketCreate {
    title: string;
    description: string;
    serviceId: number;
    priority: "low" | "medium" | "high" | "critical";


}

// For updating ticket status, priority, or assignment
export interface TicketUpdate {
    status?: TicketStatus;
    priority?: TicketPriority;
    // allow null for unassigning tickets
    assignedTo?: number | null;
}
