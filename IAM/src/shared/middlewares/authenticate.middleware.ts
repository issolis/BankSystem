import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const publicKey = fs.readFileSync(path.resolve("keys/public.pem"), "utf8");

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ success: false, error: "Missing or invalid authorization header" });
            return;
        }

        const token = authHeader.split(" ")[1] as string;
        const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as jwt.JwtPayload;

        (req as any).user = {
            sub: payload.sub,
            clearance_level: payload.clearance_level,
            integrity_level: payload.integrity_level, 
            role: payload.role
        };

        next();
    } catch (error) {
        res.status(401).json({ success: false, error: "Invalid or expired token" });
    }
}