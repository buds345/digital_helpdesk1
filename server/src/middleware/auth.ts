import { Request, Response, NextFunction } from "express";
import { verify } from "../utils/jwt";

export interface AuthedRequest extends Request {
    user?: { id: number; role: string; name: string; email: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
    const hdr = req.headers.authorization;
    if (!hdr?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });
    try {
        req.user = verify(hdr.slice(7));
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

export function requireRole(...roles: string[]) {
    return (req: AuthedRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });
        if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
        next();
    };
}
