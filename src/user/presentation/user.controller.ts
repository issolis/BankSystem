import type { Request, Response } from "express";
import { FindUserByIdUseCase } from "../application/use-cases/find-user-by-id.js";
import { FindAllUsersUseCase } from "../application/use-cases/find-all-users.js";
import { AppError } from "../shared/errors/app.error.js";

export class UserController {
    constructor(
        private readonly findUserByIdUseCase: FindUserByIdUseCase,
        private readonly findAllUsersUseCase: FindAllUsersUseCase
    ) {
        this.findById = this.findById.bind(this);
        this.findAll = this.findAll.bind(this);
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.findUserByIdUseCase.execute(req.params.id as string);

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
            } if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.findAllUsersUseCase.execute();

            res.status(200).json({
                success: true,
                data: users.map(user => ({
                    id: user.getId().getValue(),
                    username: user.getUsername().getUsername(),
                    clearance_level: user.getSecurityLevel().getClearance(),
                    integrity_level: user.getSecurityLevel().getIntegrity()
                }))
            });

        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status).json({
                    success: false,
                    error: error.message
                });
            } if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }
}