import type { TransactionRepository } from "../../domain/repositories/transaction.repository.js";
import type { Transaction } from "../../domain/entities/transaction.entity.js";

export class FindAllTransactionsUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepository
    ) {}

    async execute(): Promise<Transaction[]> {
        return await this.transactionRepository.findAll();
    }
}