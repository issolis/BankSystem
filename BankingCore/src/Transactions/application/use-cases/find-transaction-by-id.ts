import { AppError } from "../../../shared/errors/app.error.js";
import type { TransactionRepository } from "../../domain/repositories/transaction.repository.js";
import { TransactionId } from "../../domain/value-objects/transaction-id.vo.js";
import type { Transaction } from "../../domain/entities/transaction.entity.js";

export class FindTransactionByIdUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepository
    ) {}

    async execute(uuid: string): Promise<Transaction> {
        const transactionId = new TransactionId(uuid);
        const transaction = await this.transactionRepository.findById(transactionId);

        if (!transaction) {
            throw new AppError(`Transaction with id ${uuid} not found`, 404);
        }

        return transaction;
    }
}