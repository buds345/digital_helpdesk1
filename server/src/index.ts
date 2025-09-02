import "reflect-metadata";
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";

import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/", (_, res) => res.send("✅ Digital Help Desk API is running..."));
app.get("/api/health", (_, res) => res.json({ status: "OK", message: "Server is running" }));

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected successfully");
        const PORT = Number(process.env.PORT || 3001);
        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    });

export default app;
