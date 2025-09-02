import express from "express";
import { AppDataSource } from "../config/db";
import authRoutes from "../routes/auth.routes";

const app = express();
app.use(express.json());

// Initialize DB before server starts
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected successfully");

        // only start server after DB is ready
        app.listen(3001, () => {
            console.log("🚀 Server running on http://localhost:3001");
        });
    })
    .catch((err: any) => {
        console.error("❌ Database connection error:", err);
    });

app.use("/auth", authRoutes);
