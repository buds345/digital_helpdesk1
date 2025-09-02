"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const data_source_1 = require("../data-source");
const Comment_1 = require("./../entities/Comment");
const Ticket_1 = require("./../entities/Ticket");
const User_1 = require("./../entities/User");
exports.commentRouter = (0, express_1.Router)();
const comments = () => data_source_1.AppDataSource.getRepository(Comment_1.Comment);
const tickets = () => data_source_1.AppDataSource.getRepository(Ticket_1.Ticket);
const users = () => data_source_1.AppDataSource.getRepository(User_1.User);
exports.commentRouter.use(auth_1.requireAuth);
exports.commentRouter.post("/", async (req, res) => {
    const schema = zod_1.z.object({ ticketId: zod_1.z.number(), body: zod_1.z.string().min(1) });
    const { ticketId, body } = schema.parse(req.body);
    const ticket = await tickets().findOneBy({ id: ticketId });
    if (!ticket)
        return res.status(404).json({ error: "Ticket not found" });
    const author = await users().findOneByOrFail({ id: req.user.id });
    const c = comments().create({ body, author, ticket });
    await comments().save(c);
    res.status(201).json(c);
});
exports.commentRouter.get("/:ticketId", async (req, res) => {
    const ticketId = Number(req.params.ticketId);
});
exports.default = exports.commentRouter;
