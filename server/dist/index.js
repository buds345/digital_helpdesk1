import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import cors from "cors";
import dotenv from "dotenv";

// Entities
import { User } from "./entities/User";
import { Ticket } from "./entities/Ticket";
import { Comment } from "./entities/Comment";

// Routes
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import commentRoutes from "./routes/comment.routes";

dotenv.config();

// Create TypeORM DataSource
export const AppDataSource = new DataSource({
    type: "postgres", // 🔥 changed from mysql → postgres
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // only in dev; in prod use migrations
    logging: false,
    entities: [User, Ticket, Comment],
    migrations: [],
    subscribers: [],
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/comments", commentRoutes);

// Start server only after DB connection
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected successfully");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
    });

export default app;
