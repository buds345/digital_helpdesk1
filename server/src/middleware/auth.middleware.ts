import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user"; // Fixed import with capital U

// Extend Express Request to include user
export interface AuthRequest extends Request {
    user?: User;
}

// Main authentication middleware
export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        // Check for token in both Authorization header and cookies
        let token: string | undefined;

        if (authHeader) {
            const [scheme, authToken] = authHeader.split(" ");
            if (scheme === "Bearer" && authToken) {
                token = authToken;
            }
        }

        // Also check for token in cookies (if you're using cookies)
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key-2024") as {
            userId: number;
        };

        // Fetch user from DB
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: decoded.userId },
            select: ["id", "name", "email", "role",] // Only select necessary fields
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid token - user not found" });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error: any) {
        console.error("Auth middleware error:", error.message);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        return res.status(401).json({ message: "Unauthorized" });
    }
}

// Role-based authorization
export function requireRole(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: Requires ${roles.join(" or ")} role`
            });
        }
        next();
    };
}

// Optional: Token verification utility
export function verifyToken(token: string): { userId: number } | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key-2024") as { userId: number };
    } catch (error) {
        return null;
    }
}