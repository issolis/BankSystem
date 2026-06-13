import { Router } from "express";
import { UserController } from "./user.controller.js";
import { UserValidator } from "./user.validator.js";
import { FindUserByIdUseCase } from "../application/use-cases/find-user-by-id.js";
import { FindAllUsersUseCase } from "../application/use-cases/find-all-users.js";
import { UserRepositoryImpl } from "../infrastructure/repositories/user.repository.impl.js";
import { CreateUserUseCase } from "../application/use-cases/create-user.js";
import { requireAdmin } from "../../shared/middlewares/require-admin.middleware.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";

const userRepository = new UserRepositoryImpl();
const findUserByIdUseCase = new FindUserByIdUseCase(userRepository);
const findAllUsersUseCase = new FindAllUsersUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository); 
const userController = new UserController(findUserByIdUseCase, findAllUsersUseCase, createUserUseCase);

export const userRouter = Router();

userRouter.use(authenticate, requireAdmin);

userRouter.get("/", userController.findAll);
userRouter.get("/:id", UserValidator.validateFindById, userController.findById);
userRouter.post("/",UserValidator.validateCreate, userController.create);