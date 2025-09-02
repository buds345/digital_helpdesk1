export type TicketStatus =
    | 'open'
    | 'in_progress'
    | 'waiting_on_client'
    | 'resolved'
    | 'closed';

export type TicketPriority =
    | 'low'
    | 'medium'
    | 'high'
    | 'critical';

export interface Service {
    id: number;
    name: string;
    description?: string;
    defaultTimeframeHours?: number;
    baseCost?: number;
}

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    service: Service;
    clientId: number;
    assignedTo?: number;
    estimatedHours?: number;
    estimatedCost?: number;
    actualHours?: number;
    actualCost?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TicketCreate {
    title: string;
    description: string;
    serviceId: number;
    priority: TicketPriority;
    clientId?: number; // Will be set from auth token
}

export interface TicketUpdate {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedTo?: number;
    estimatedHours?: number;
    estimatedCost?: number;
    actualHours?: number;
    actualCost?: number;
}

export interface TicketUpdateMessage {
    id?: number;
    ticketId: number;
    userId: number;
    updateText: string;
    statusChange?: TicketStatus;
    createdAt: Date;
}

export interface TicketAttachment {
    id: number;
    ticketId: number;
    fileName: string;
    filePath: string;
    uploadedBy: number;
    uploadedAt: Date;
}