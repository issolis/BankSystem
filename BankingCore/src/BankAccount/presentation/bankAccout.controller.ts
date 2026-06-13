import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/app.error.js";
import { FindBankAccountByIdUseCase } from "../application/use-cases/find-bank-account-by-id.js";
import { FindBankAccountByOwnerIdUseCase } from "../application/use-cases/find-bank-account-by-ownerid.js";
import { FindAllBankAccountsUseCase } from "../application/use-cases/find-all-bank-accounts.js";
import { CreateBankAccountUseCase } from "../application/use-cases/create-bank-account.js";

export class BankAccountController {
    constructor(
        private readonly findBankAccountByIdUseCase: FindBankAccountByIdUseCase,
        private readonly findBankAccountByOwnerIdUseCase: FindBankAccountByOwnerIdUseCase,
        private readonly findAllBankAccountsUseCase: FindAllBankAccountsUseCase,
        private readonly createBankAccountUseCase: CreateBankAccountUseCase
    ) {
        this.findById = this.findById.bind(this);
        this.findByOwnerId = this.findByOwnerId.bind(this);
        this.findAll = this.findAll.bind(this);
        this.create = this.create.bind(this);
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const bankAccount = await this.findBankAccountByIdUseCase.execute(req.params.id as string);

            res.status(200).json({
                success: true,
                data: {
                    id: bankAccount.getAccountId().getValue(),
                    owner_id: bankAccount.getOwnerId().getValue(),
                    balance: bankAccount.getMoney().getValue().toString()
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status).json({ success: false, error: error.message });
            } if (error instanceof Error) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    }

    async findByOwnerId(req: Request, res: Response): Promise<void> {
        try {
            const bankAccount = await this.findBankAccountByOwnerIdUseCase.execute(req.params.ownerId as string);

            res.status(200).json({
                success: true,
                data: {
                    id: bankAccount.getAccountId().getValue(),
                    owner_id: bankAccount.getOwnerId().getValue(),
                    balance: bankAccount.getMoney().getValue().toString()
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status).json({ success: false, error: error.message });
            } if (error instanceof Error) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const bankAccounts = await this.findAllBankAccountsUseCase.execute();

            res.status(200).json({
                success: true,
                data: bankAccounts.map(bankAccount => ({
                    id: bankAccount.getAccountId().getValue(),
                    owner_id: bankAccount.getOwnerId().getValue(),
                    balance: bankAccount.getMoney().getValue().toString()
                }))
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status).json({ success: false, error: error.message });
            } if (error instanceof Error) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const bankAccount = await this.createBankAccountUseCase.execute(
                req.body.owner_uuid,
                req.body.initial_balance
            );

            res.status(201).json({
                success: true,
                data: {
                    id: bankAccount.getAccountId().getValue(),
                    owner_id: bankAccount.getOwnerId().getValue(),
                    balance: bankAccount.getMoney().getValue().toString()
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status).json({ success: false, error: error.message });
            } if (error instanceof Error) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    }
}