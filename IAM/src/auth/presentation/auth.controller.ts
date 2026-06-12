import type { Request, Response } from "express";
import { LoginUseCase } from "../application/use-cases/login.js";
import { AppError } from "../../shared/errors/app.error.js";
import { Username } from "../../user/domain/value-objects/username.vo.js";
import { Password } from "../../user/domain/value-objects/password.vo.js";

export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase
    ) {
        this.handleLogin = this.handleLogin.bind(this);
    }

    async handleLogin(req: Request, res: Response): Promise<void> {

        try {
            const token = await this.loginUseCase.execute(
                new Username(req.body.username),
                new Password(req.body.password)
            )
            res.status(200).json({
                success: true,
                data: { token }
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