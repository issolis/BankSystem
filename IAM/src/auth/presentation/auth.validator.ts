import type { Request, Response, NextFunction } from "express";

export class AuthValidator {

    static validateLogin(req: Request, res: Response, next: NextFunction): void {
        try {
            const { username, password } = req.body;

            if (!username) throw new Error("Username cannot be empty");
            if (!password) throw new Error("Password cannot be empty");

            next();
        } catch (error) {
            res.status(422).json({
                success: false,
                error: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }
}