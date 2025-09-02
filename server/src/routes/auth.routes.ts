import { Router } from "express";
import { register, login, verifyEmail, } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);


// Protected routes


export default router;