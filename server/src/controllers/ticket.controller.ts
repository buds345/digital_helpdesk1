// src/controllers/ticket.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Ticket, TicketStatus } from "../entities/Ticket";
import { User } from "../entities/user";
import { Service } from "../entities/Services";
import { AuthRequest } from "../middleware/auth.middleware";
import { emailService } from "../services/emailService";

// Create ticket
export const createTicket = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, serviceId, priority } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const ticketRepo = AppDataSource.getRepository(Ticket);
        const userRepo = AppDataSource.getRepository(User);
        const serviceRepo = AppDataSource.getRepository(Service);

        const client = await userRepo.findOneBy({ id: Number(userId) });
        if (!client) return res.status(404).json({ message: "Client not found" });

        const service = await serviceRepo.findOneBy({ id: Number(serviceId) });
        if (!service) return res.status(404).json({ message: "Service not found" });

        const ticket = ticketRepo.create({
            title,
            description,
            priority,
            status: TicketStatus.OPEN,
            client,
            service,
            assignedTo: null,
        });

        const newTicket = await ticketRepo.save(ticket);
        res.status(201).json({ data: newTicket });
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all tickets (admin)
export const getAllTickets = async (req: AuthRequest, res: Response) => {
    try {
        const ticketRepo = AppDataSource.getRepository(Ticket);
        const tickets = await ticketRepo.find({
            relations: ["client", "assignedTo", "service"],
            order: { createdAt: "DESC" },
        });
        res.json({ data: tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get ticket by ID
export const getTicketById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const ticketRepo = AppDataSource.getRepository(Ticket);
        const ticket = await ticketRepo.findOne({
            where: { id: Number(id) },
            relations: ["client", "assignedTo", "service"],
        });
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        res.json({ data: ticket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get tickets assigned to logged-in support staff
export const getStaffTickets = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const ticketRepo = AppDataSource.getRepository(Ticket);
        const tickets = await ticketRepo.find({
            where: { assignedTo: { id: req.user.id } },
            relations: ["client", "service", "assignedTo"],
            order: { createdAt: "DESC" },
        });

        res.json({ data: tickets });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Assign / Unassign ticket to support staff
export const assignTicket = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

        const ticketRepo = AppDataSource.getRepository(Ticket);
        const userRepo = AppDataSource.getRepository(User);

        const ticket = await ticketRepo.findOne({
            where: { id: Number(id) },
            relations: ["assignedTo", "client", "service"],
        });
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        // Store previous assignment for comparison
        const previousAssignee = ticket.assignedTo;
        let newAssignee = null;

        if (userId) {
            const staff = await userRepo.findOneBy({ id: Number(userId) });
            if (!staff) return res.status(404).json({ message: "User not found" });

            if (staff.role !== "support") {
                return res.status(400).json({ message: "Only support staff can be assigned tickets" });
            }

            newAssignee = staff;
            ticket.assignedTo = staff;
            ticket.status = TicketStatus.IN_PROGRESS;
        } else {
            ticket.assignedTo = null;
            ticket.status = TicketStatus.OPEN; // Changed from UNASSIGNED to OPEN
        }

        const updatedTicket = await ticketRepo.save(ticket);

        if (newAssignee && (!previousAssignee || previousAssignee.id !== newAssignee.id)) {
            try {
                await emailService.sendTicketAssignmentEmail(
                    newAssignee.email,
                    newAssignee.name,
                    ticket.id.toString(),
                    ticket.title,
                    ticket.description,
                    ticket.priority,
                    ticket.client?.name || "Unknown Client"
                );
                console.log(`✅ Assignment notification sent to ${newAssignee.email}`);
            } catch (emailError) {
                console.error("❌ Failed to send assignment notification:", emailError);
            }
        }

        res.json({
            message: "Ticket assigned successfully",
            data: updatedTicket,
            emailSent: newAssignee ? true : false,
        });
    } catch (err) {
        console.error("Error assigning ticket:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ FIXED: Update ticket (status, priority, etc.)
export const updateTicket = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, priority, title, description, assignedTo } = req.body;

        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        // Only allow admin/support to update
        if (req.user.role !== "admin" && req.user.role !== "support") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const ticketRepo = AppDataSource.getRepository(Ticket);
        const userRepo = AppDataSource.getRepository(User);

        const ticket = await ticketRepo.findOne({
            where: { id: Number(id) },
            relations: ["assignedTo", "client", "service"]
        });

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        // Validate status if provided
        if (status && !Object.values(TicketStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Validate priority if provided
        const validPriorities = ['low', 'medium', 'high'];
        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ message: "Invalid priority value" });
        }

        // Update fields if provided
        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;
        if (title) ticket.title = title;
        if (description) ticket.description = description;

        // Handle assignment if provided
        if (assignedTo !== undefined) {
            if (assignedTo === null) {
                ticket.assignedTo = null;
            } else if (typeof assignedTo === 'number') {
                const user = await userRepo.findOneBy({ id: assignedTo });
                if (!user) return res.status(404).json({ message: "User not found" });
                ticket.assignedTo = user;
            }
        }

        const updatedTicket = await ticketRepo.save(ticket);

        res.json({
            message: "Ticket updated successfully",
            data: updatedTicket
        });
    } catch (err: any) {
        console.error("Error updating ticket:", err);

        // Handle database validation errors
        if (err.code === '23502') { // not null violation
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (err.code === '23505') { // unique violation
            return res.status(400).json({ message: "Duplicate entry" });
        }

        res.status(500).json({ message: "Server error" });
    }
};