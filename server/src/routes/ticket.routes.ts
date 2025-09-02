// src/routes/ticket.routes.ts
import { Router } from "express";
import { AppDataSource } from "../config/data-source";
import { Ticket } from "../entities/Ticket";
import { User } from "../entities/user";
import {
    assignTicket,
    createTicket,
    getAllTickets,
    getTicketById,
    getStaffTickets,
    updateTicket
} from "../controllers/ticket.controller";
import { authMiddleware, requireRole } from "../middleware/auth.middleware";

const router = Router();

// GET all tickets
router.get("/", authMiddleware, getAllTickets);

// GET staff tickets
router.get("/staff", authMiddleware, requireRole("support"), getStaffTickets);

// GET single ticket by ID
router.get("/:id", authMiddleware, getTicketById);

// POST create new ticket
router.post("/", authMiddleware, createTicket);

// PUT update ticket (status, priority, etc.)
router.put("/:id", authMiddleware, updateTicket);

// PATCH assign ticket
router.patch("/:id/assign", authMiddleware, assignTicket);

// Optional: PUT assign ticket (alternative route)
router.put("/:id/assign", authMiddleware, async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;

    try {
        const ticketRepo = AppDataSource.getRepository(Ticket);
        const userRepo = AppDataSource.getRepository(User);

        const ticket = await ticketRepo.findOne({
            where: { id: Number(id) },
            relations: ["assignedTo", "client", "service"]
        });
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        if (userId) {
            const user = await userRepo.findOne({ where: { id: Number(userId) } });
            if (!user) return res.status(404).json({ message: "User not found" });
            ticket.assignedTo = user;
        } else {
            ticket.assignedTo = null; // unassign
        }

        await ticketRepo.save(ticket);
        res.json({ data: ticket });
    } catch (err) {
        console.error("Error assigning ticket:", err);
        res.status(500).json({ message: "Error assigning ticket" });
    }
});

export default router;