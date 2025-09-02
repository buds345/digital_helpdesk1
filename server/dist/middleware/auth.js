"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
function requireAuth(req, res, next) {
    const hdr = req.headers.authorization;
    if (!hdr?.startsWith("Bearer "))
        return res.status(401).json({ error: "Missing token" });
    try {
        req.user = (0, jwt_1.verify)(hdr.slice(7));
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        if (!roles.includes(req.user.role))
            return res.status(403).json({ error: "Forbidden" });
        next();
    };
}
