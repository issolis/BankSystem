
import type { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    console.log(req.user)
    if (req.user?.role !== "ADMIN") {
        res.status(403).json({ success: false, error: "Admin access required" });
        return;
    }
    next();
}