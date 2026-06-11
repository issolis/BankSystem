import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { UserValidator } from "../validators/user.validator.js";
import { FindUserByIdUseCase } from "../../application/use-cases/find-user-by-id.js";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository.impl.js";

const userRepository = new UserRepositoryImpl();
const findUserByIdUseCase = new FindUserByIdUseCase(userRepository);
const userController = new UserController(findUserByIdUseCase);

export const userRouter = Router();

userRouter.get("/:id", UserValidator.validateFindById, userController.findById);