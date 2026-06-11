import type { Request, Response } from "express";
import { FindUserByIdUseCase } from "../../application/use-cases/find-user-by-id.js";
import { AppError } from "../../shared/errors/app.error.js";

export class UserController {
    constructor(
        private readonly findUserByIdUseCase: FindUserByIdUseCase
    ) {
        this.findById = this.findById.bind(this);
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {

            console.log("hello")
            const user = await this.findUserByIdUseCase.execute(req.params.id as string);

            console.log("hello")

            res.status(200).json({
                success: true,
                data: {
                    id: user.getId().getValue(),
                    username: user.getUsername().getUsername(),
                    clearance_level: user.getSecurityLevel().getClearance(),
                    integrity_level: user.getSecurityLevel().getIntegrity()
                }
            });

        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status).json({
                    success: false,
                    error: error.message
                });
            } if (error instanceof Error)  {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }
}