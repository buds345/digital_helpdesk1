import { Router } from "express";

const router = Router();

// Test endpoint
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working!",
        timestamp: new Date().toISOString()
    });
});

export default router;