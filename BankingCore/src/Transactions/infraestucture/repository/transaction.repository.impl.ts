import { Pool } from "pg";
import pool from "../database/postgres.database.js";
import type { TransactionRepository } from "../../domain/repositories/transaction.repository.js";
import type { Transaction } from "../../domain/entities/transaction.entity.js";
import type { TransactionId } from "../../domain/value-objects/transaction-id.vo.js";
import type { TransactionModel } from "../models/transaction.model.js";
import { TransactionMapper } from "../mappers/transaction.mapper.js";

export class TransactionRepositoryImpl implements TransactionRepository {

    constructor(
        private readonly db: Pool = pool
    ) {}

    async findById(transactionId: TransactionId): Promise<Transaction | null> {
        try {
            const result = await this.db.query(
                `SELECT uuid, account_remitter_uuid, account_receiver_uuid, amount, status, rejection_reason, created_at
                 FROM transactions
                 WHERE uuid = $1`,
                [transactionId.getValue()]
            );

            if (!result.rows[0]) return null;

            return TransactionMapper.toDomain(result.rows[0] as TransactionModel);
        } catch (error) {
            throw new Error(`Failed to find transaction by id: ${error instanceof Error ? error.message : error}`);
        }
    }

    async findAll(): Promise<Transaction[]> {
        try {
            const result = await this.db.query(
                `SELECT uuid, account_remitter_uuid, account_receiver_uuid, amount, status, rejection_reason, created_at
                 FROM transactions`
            );

            return result.rows.map(row => TransactionMapper.toDomain(row as TransactionModel));
        } catch (error) {
            throw new Error(`Failed to find transactions: ${error instanceof Error ? error.message : error}`);
        }
    }

    async create(transaction: Transaction): Promise<Transaction> {
        try {
            const transactionDB = TransactionMapper.toPersistence(transaction);
            const result = await this.db.query(
                `INSERT INTO transactions (uuid, account_remitter_uuid, account_receiver_uuid, amount, status, rejection_reason, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [
                    transactionDB.uuid,
                    transactionDB.account_remitter_uuid,
                    transactionDB.account_receiver_uuid,
                    transactionDB.amount,
                    transactionDB.status,
                    transactionDB.rejection_reason,
                    transactionDB.created_at
                ]
            );

            return TransactionMapper.toDomain(result.rows[0] as TransactionModel);
        } catch (error) {
            throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : error}`);
        }
    }
}