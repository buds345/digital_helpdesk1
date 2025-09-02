import express from "express";
import cors from "cors";

import "express-async-errors";
import { AppDataSource } from "./config/data-source";

import ticketRouter from "./routes/ticket.routes";
import { commentRouter } from "./routes/comment.routes";
import { errorHandler } from "./utils/error";

export const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res) => res.json({ ok: true, service: "helpdesk-api" }));


app.use("/api/tickets", ticketRouter);
app.use("/api/comments", commentRouter);

app.use(errorHandler);

// Initialize DB right away
AppDataSource.initialize()
    .then(() => console.log("✅ MySQL connected"))
    .catch((e) => {
        console.error("❌ DB init error:", e);
        process.exit(1);
    });
