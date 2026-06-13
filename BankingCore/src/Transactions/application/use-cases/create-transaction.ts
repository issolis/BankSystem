import { AppError } from "../../../shared/errors/app.error.js";
import type { TransactionRepository } from "../../domain/repositories/transaction.repository.js";
import type { BankAccountRepository } from "../../../BankAccount/domain/repositories/bank-account.repository.js";
import { TransactionProcessor } from "../../domain/services/transaction-processor.service.js";
import type { Transaction } from "../../domain/entities/transaction.entity.js";

export class CreateTransactionUseCase {
    private readonly transactionProcessor: TransactionProcessor;

    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly bankAccountRepository: BankAccountRepository
    ) {
        this.transactionProcessor = new TransactionProcessor(
            bankAccountRepository,
            transactionRepository
        );
    }

    async execute(
        remitterAccountUuid: string,
        receiverAccountUuid: string,
        amount: number,
        requesterIntegrityLevel: number
    ): Promise<Transaction> {
        return await this.transactionProcessor.process(
            remitterAccountUuid,
            receiverAccountUuid,
            amount,
            requesterIntegrityLevel
        );
    }
}