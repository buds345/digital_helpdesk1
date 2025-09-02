"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const index_js_1 = require("../index.js");
const Ticket_js_1 = require("../entities/Ticket.js");
const User_js_1 = require("../entities/User.js");
const router = (0, express_1.Router)();
// Example: create a new ticket
router.post("/", async (req, res) => {
    try {
        const schema = zod_1.z.object({
            title: zod_1.z.string(),
            description: zod_1.z.string(),
            userId: zod_1.z.number(),
        });
        const { title, description, userId } = schema.parse(req.body);
        const user = await index_js_1.AppDataSource.getRepository(User_js_1.User).findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const ticket = new Ticket_js_1.Ticket();
        ticket.title = title;
        ticket.description = description;
        ticket.user = user;
        await index_js_1.AppDataSource.getRepository(Ticket_js_1.Ticket).save(ticket);
        res.status(201).json(ticket);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router; // 👈 this is the important part
