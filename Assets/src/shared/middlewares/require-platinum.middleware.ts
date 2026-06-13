import type { Request, Response, NextFunction } from "express";

export function requirePlatinum(req: Request, res: Response, next: NextFunction): void {
    if (req.user?.clearance_level !== "PLATINUM") {
        res.status(403).json({ success: false, error: "Bell-LaPadula violation: No Read Up - PLATINUM clearance required" });
        return;
    }
    next();
}