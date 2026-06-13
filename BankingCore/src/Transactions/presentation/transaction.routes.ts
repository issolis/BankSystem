import { Router } from "express";
import { TransactionController } from "./transaction.controller.js";
import { TransactionValidator } from "./transaction.validator.js";
import { TransactionRepositoryImpl } from "../infraestucture/repository/transaction.repository.impl.js";
import { BankAccountRepositoryImpl } from "../../BankAccount/infraestucture/repositories/bank-account.repository.impl.js";
import { CreateTransactionUseCase } from "../application/use-cases/create-transaction.js";
import { FindTransactionByIdUseCase } from "../application/use-cases/find-transaction-by-id.js";
import { FindAllTransactionsUseCase } from "../application/use-cases/find-all-transactions.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { requireSelfFromBody } from "../../shared/middlewares/require-self-from-body.middleware.js";
import { requireAdmin } from "../../shared/middlewares/require-admin.middleware.js";


const transactionRepository = new TransactionRepositoryImpl();
const bankAccountRepository = new BankAccountRepositoryImpl();

const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository, bankAccountRepository);
const findTransactionByIdUseCase = new FindTransactionByIdUseCase(transactionRepository);
const findAllTransactionsUseCase = new FindAllTransactionsUseCase(transactionRepository);

const transactionController = new TransactionController(
    createTransactionUseCase,
    findTransactionByIdUseCase,
    findAllTransactionsUseCase
);

export const transactionRouter = Router();

transactionRouter.use(authenticate);

transactionRouter.get("/", requireAdmin, transactionController.findAll);
transactionRouter.get("/:id", requireAdmin, TransactionValidator.validateFindById, transactionController.findById);

transactionRouter.post("/", authenticate, requireSelfFromBody, TransactionValidator.validateCreate, transactionController.create);