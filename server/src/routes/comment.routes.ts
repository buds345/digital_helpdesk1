import { Router } from "express";
import { z } from "zod";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { AppDataSource } from "../config/data-source";
import { Comment } from "./../entities/Comment";
import { Ticket } from "./../entities/Ticket";
import { User } from "../entities/user";

export const commentRouter = Router();
const comments = () => AppDataSource.getRepository(Comment);
const tickets = () => AppDataSource.getRepository(Ticket);
const users = () => AppDataSource.getRepository(User);

commentRouter.use(requireAuth);

commentRouter.post("/", async (req: AuthedRequest, res) => {
    const schema = z.object({ ticketId: z.number(), body: z.string().min(1) });
    const { ticketId, body } = schema.parse(req.body);

    const ticket = await tickets().findOneBy({ id: ticketId });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const author = await users().findOneByOrFail({ id: req.user!.id });
    const c = comments().create({ body, author, ticket });
    await comments().save(c);
    res.status(201).json(c);
});

commentRouter.get("/:ticketId", async (req, res) => {
    const ticketId = Number(req.params.ticketId);


});
export default commentRouter