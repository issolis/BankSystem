import type { Request, Response, NextFunction } from "express";

export class VIPAssetValidator {

    static validateFindById(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = req.params.id as string;

            if (!id || !id.trim()) throw new Error("Asset id cannot be empty");
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
                throw new Error("Invalid asset id format");

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
            const { name, value } = req.body;

            if (!name || !name.trim()) throw new Error("Asset name cannot be empty");
            if (name.trim().length < 3) throw new Error("Asset name must be at least 3 characters");

            if (value === undefined || value === null) throw new Error("Asset value cannot be empty");
            if (isNaN(Number(value)) || Number(value) <= 0) throw new Error("Asset value must be a positive number");

            next();
        } catch (error) {
            res.status(422).json({
                success: false,
                error: error instanceof Error ? error.message : "Invalid request"
            });
        }
    }
}