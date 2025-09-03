// src/routes/auth.routes.ts
import { Router } from "express";
import {
    register,
    login,
    verifyEmail,
    forgotPassword,  // Add this import
    resetPassword    // Add this import
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);  // Add this route
router.post("/reset-password", resetPassword);    // Add this route

// Protected routes

export default router;