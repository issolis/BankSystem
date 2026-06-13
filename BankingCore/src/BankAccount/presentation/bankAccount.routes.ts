import { Router } from "express";
import { BankAccountController } from "./bankAccout.controller.js";
import { BankAccountValidator } from "./bankAccount.validator.js";
import { BankAccountRepositoryImpl } from "../infraestucture/repositories/bank-account.repository.impl.js";
import { FindBankAccountByIdUseCase } from "../application/use-cases/find-bank-account-by-id.js";
import { FindBankAccountByOwnerIdUseCase } from "../application/use-cases/find-bank-account-by-ownerid.js";
import { FindAllBankAccountsUseCase } from "../application/use-cases/find-all-bank-accounts.js";
import { CreateBankAccountUseCase } from "../application/use-cases/create-bank-account.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { requireAdmin } from "../../shared/middlewares/require-admin.middleware.js";


const bankAccountRepository = new BankAccountRepositoryImpl();
const findBankAccountByIdUseCase = new FindBankAccountByIdUseCase(bankAccountRepository);
const findBankAccountByOwnerIdUseCase = new FindBankAccountByOwnerIdUseCase(bankAccountRepository);
const findAllBankAccountsUseCase = new FindAllBankAccountsUseCase(bankAccountRepository);
const createBankAccountUseCase = new CreateBankAccountUseCase(bankAccountRepository);

const bankAccountController = new BankAccountController(
    findBankAccountByIdUseCase,
    findBankAccountByOwnerIdUseCase,
    findAllBankAccountsUseCase,
    createBankAccountUseCase
);

export const bankAccountRouter = Router();

bankAccountRouter.use(authenticate, requireAdmin);

bankAccountRouter.get("/", bankAccountController.findAll);
bankAccountRouter.get("/owner/:ownerId", BankAccountValidator.validateFindByOwnerId, bankAccountController.findByOwnerId);
bankAccountRouter.get("/:id", BankAccountValidator.validateFindById, bankAccountController.findById);
bankAccountRouter.post("/", BankAccountValidator.validateCreate, bankAccountController.create);