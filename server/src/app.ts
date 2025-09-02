import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import React from "react";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use("/api/auth", authRoutes);

// Test root
app.get("/", (req, res) => {
    res.send("Digital Help Desk API is running...");
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
export default app;


