import type { Request, Response, NextFunction } from "express";

export class TransactionValidator {

    static validateFindById(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = req.params.id as string;

            if (!id || !id.trim()) throw new Error("Transaction id cannot be empty");
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
                throw new Error("Invalid transaction id format");

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
            const { remitter_account_uuid, receiver_account_uuid, amount } = req.body;

            if (!remitter_account_uuid || !remitter_account_uuid.trim())
                throw new Error("Remitter account uuid cannot be empty");
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(remitter_account_uuid))
                throw new Error("Invalid remitter account uuid format");

            if (!receiver_account_uuid || !receiver_account_uuid.trim())
                throw new Error("Receiver account uuid cannot be empty");
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(receiver_account_uuid))
                throw new Error("Invalid receiver account uuid format");

            if (amount === undefined || amount === null)
                throw new Error("Amount cannot be empty");
            if (isNaN(Number(amount)) || Number(amount) <= 0)
                throw new Error("Amount must be a positive number");

            next();
        } catch (error) {
            res.status(422).json({
                success: false,
                error: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }
}