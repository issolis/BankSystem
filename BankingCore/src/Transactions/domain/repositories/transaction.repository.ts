import type { Transaction } from "../entities/transaction.entity.js";
import type { TransactionId } from "../value-objects/transaction-id.vo.js";

export interface TransactionRepository {
    findById(transactionId: TransactionId): Promise<Transaction | null>;
    findAll(): Promise<Transaction[]>;
    create(transaction: Transaction): Promise<Transaction>;
}