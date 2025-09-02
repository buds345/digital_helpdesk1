import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    user?: {
        role: string;
    };
}

const authorize = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role!)) {
            return res.status(403).json({
                message: `User role ${req.user?.role} is not authorized to access this route`
            });
        }
        next();
    };
};

export default authorize;