import type { Request, Response, NextFunction } from "express";

export class BankAccountValidator {

    static validateFindById(req: Request, res: Response, next: NextFunction): void {
        try {

            const id = req.params.id as string; 

            if (!id || !id.trim()) throw new Error("Account id cannot be empty");
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
                throw new Error("Invalid account id format");

            next();
        } catch (error) {
            res.status(422).json({
                success: false,
                error: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }

    static validateFindByOwnerId(req: Request, res: Response, next: NextFunction): void {
        try {
            const ownerId = req.params.ownerId as string; 

            if (!ownerId || !ownerId.trim()) throw new Error("Owner id cannot be empty");
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(ownerId))
                throw new Error("Invalid owner id format");

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
            const { owner_uuid, initial_balance } = req.body;

            if (!owner_uuid || !owner_uuid.trim()) throw new Error("Owner uuid cannot be empty");

            if (initial_balance === undefined || initial_balance === null)
                throw new Error("Initial balance cannot be empty");
            if (isNaN(Number(initial_balance)) || Number(initial_balance) < 0)
                throw new Error("Initial balance must be a non-negative number");

            next();
        } catch (error) {
            res.status(422).json({
                success: false,
                error: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }
}