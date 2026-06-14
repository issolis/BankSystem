import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/app.error.js";
import { CreateTransactionUseCase } from "../application/use-cases/create-transaction.js";
import { FindTransactionByIdUseCase } from "../application/use-cases/find-transaction-by-id.js";
import { FindAllTransactionsUseCase } from "../application/use-cases/find-all-transactions.js";
export class TransactionController {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
        private readonly findTransactionByIdUseCase: FindTransactionByIdUseCase,
        private readonly findAllTransactionsUseCase: FindAllTransactionsUseCase
    ) {
        this.create = this.create.bind(this);
        this.findById = this.findById.bind(this);
        this.findAll = this.findAll.bind(this);
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization!.split(" ")[1] as string;

            const transaction = await this.createTransactionUseCase.execute(
                req.body.remitter_account_uuid,
                req.body.receiver_account_uuid,
                req.body.amount,
                req.user!.integrity_level,
                token
            );

            const status = transaction.getStatus();

            res.status(status === "COMPLETED" ? 201 : 403).json({
                success: status === "COMPLETED",
                data: {
                    id: transaction.getTransactionId().getValue(),
                    remitter_account_id: transaction.getRemitterAccountId().getValue(),
                    receiver_account_id: transaction.getReceiverAccountId().getValue(),
                    amount: transaction.getMoney().getValue().toString(),
                    status: transaction.getStatus(),
                    rejection_reason: transaction.getRejectionReason().getValue(),
                    created_at: transaction.getCreatedAt().getValue()
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

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const transaction = await this.findTransactionByIdUseCase.execute(req.params.id as string);

            res.status(200).json({
                success: true,
                data: {
                    id: transaction.getTransactionId().getValue(),
                    remitter_account_id: transaction.getRemitterAccountId().getValue(),
                    receiver_account_id: transaction.getReceiverAccountId().getValue(),
                    amount: transaction.getMoney().getValue().toString(),
                    status: transaction.getStatus(),
                    rejection_reason: transaction.getRejectionReason().getValue(),
                    created_at: transaction.getCreatedAt().getValue()
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
            const transactions = await this.findAllTransactionsUseCase.execute();

            res.status(200).json({
                success: true,
                data: transactions.map(transaction => ({
                    id: transaction.getTransactionId().getValue(),
                    remitter_account_id: transaction.getRemitterAccountId().getValue(),
                    receiver_account_id: transaction.getReceiverAccountId().getValue(),
                    amount: transaction.getMoney().getValue().toString(),
                    status: transaction.getStatus(),
                    rejection_reason: transaction.getRejectionReason().getValue(),
                    created_at: transaction.getCreatedAt().getValue()
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
}