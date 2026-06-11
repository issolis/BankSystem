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
}