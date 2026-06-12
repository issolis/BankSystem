import { Router } from "express";
import { AuthValidator } from "./auth.validator.js";
import { AuthController } from "./auth.controller.js";
import { LoginUseCase } from "../application/use-cases/login.js";
import { UserRepositoryImpl } from "../../user/infrastructure/repositories/user.repository.impl.js";
import { AuthService } from "../domain/services/auth.service.js";

const userRepository = new UserRepositoryImpl();
const authService = new AuthService();
const loginUseCase = new LoginUseCase(userRepository, authService);
const authController = new AuthController(loginUseCase);

export const authRouter = Router();

authRouter.post("/login", AuthValidator.validateLogin, authController.handleLogin);