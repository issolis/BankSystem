import type { Request, Response, NextFunction } from "express";

export class UserValidator {

    static validateFindById(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = req.params.id as string;

            if (!id || !id.trim()) {
                throw new Error("User id cannot be empty");
            }

            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
                throw new Error("Invalid user id format");
            }

            next();
        } catch (error) {
            res.status(422).json({
                success: false,
                error: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }

    static validateCreate(req: Request, res: Response, next: NextFunction): void {
        try {

            const { username, password, clearance_level, integrity_level } = req.body;

    

            if (!username) throw new Error("Username cannot be empty");
            if (!password) throw new Error("Password cannot be empty");

            if (!clearance_level || !clearance_level.trim())
                throw new Error("Clearance level cannot be empty");
            if (!["BRONZE", "SILVER", "PLATINUM"].includes(clearance_level))
                throw new Error("Clearance level must be BRONZE, SILVER or PLATINUM");

            if (integrity_level === undefined || integrity_level === null)
                throw new Error("Integrity level cannot be empty");
            if (![1, 2, 3].includes(Number(integrity_level)))
                throw new Error("Integrity level must be 1, 2 or 3");

            next();
        } catch (error) {
            res.status(422).json({
                success: false,
                error: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }
}