import { Pool } from "pg";
import pool from "../database/postgres.database.js";
import type { BankAccountRepository } from "../../domain/repositories/bank-account.repository.js";
import type { BankAccount } from "../../domain/entities/bank-account.entity.js";
import { AccountId } from "../../domain/value-objects/account-id.vos.js";
import { OwnerId } from "../../domain/value-objects/owner-id.js";
import type { BankAccountModel } from "../models/bankAccount.model.js";
import { BankAccountMapper } from "../mappers/bankAccount.mappers.js";

export class BankAccountRepositoryImpl implements BankAccountRepository {

    constructor(
        private readonly db: Pool = pool
    ) {}

    async findById(accountId: AccountId): Promise<BankAccount | null> {
        try {
            const result = await this.db.query(
                `SELECT uuid, owner_uuid, balance
                 FROM bank_accounts
                 WHERE uuid = $1`,
                [accountId.getValue()]
            );

            if (!result.rows[0]) return null;

            return BankAccountMapper.toDomain(result.rows[0] as BankAccountModel);
        } catch (error) {
            throw new Error(`Failed to find bank account by id: ${error instanceof Error ? error.message : error}`);
        }
    }

    async findByOwnerId(ownerId: OwnerId): Promise<BankAccount | null> {
        try {
            const result = await this.db.query(
                `SELECT uuid, owner_uuid, balance
                 FROM bank_accounts
                 WHERE owner_uuid = $1`,
                [ownerId.getValue()]
            );

            if (!result.rows[0]) return null;

            return BankAccountMapper.toDomain(result.rows[0] as BankAccountModel);
        } catch (error) {
            throw new Error(`Failed to find bank account by owner id: ${error instanceof Error ? error.message : error}`);
        }
    }

    async findAll(): Promise<BankAccount[]> {
        try {
            const result = await this.db.query(
                `SELECT uuid, owner_uuid, balance
                 FROM bank_accounts`
            );

            return result.rows.map(row => BankAccountMapper.toDomain(row as BankAccountModel));
        } catch (error) {
            throw new Error(`Failed to find bank accounts: ${error instanceof Error ? error.message : error}`);
        }
    }

    async create(bankAccount: BankAccount): Promise<BankAccount> {
        try {
            const bankAccountDB = BankAccountMapper.toPersistence(bankAccount);
            const result = await this.db.query(
                `INSERT INTO bank_accounts
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [bankAccountDB.uuid, bankAccountDB.owner_uuid, bankAccountDB.balance]
            );

            return BankAccountMapper.toDomain(result.rows[0] as BankAccountModel);
        } catch (error) {
            throw new Error(`Failed to create bank account: ${error instanceof Error ? error.message : error}`);
        }
    }

    async update(bankAccount: BankAccount): Promise<BankAccount> {
        try {
            const bankAccountDB = BankAccountMapper.toPersistence(bankAccount);
            const result = await this.db.query(
                `UPDATE bank_accounts
                 SET balance = $1
                 WHERE uuid = $2
                 RETURNING *`,
                [bankAccountDB.balance, bankAccountDB.uuid]
            );

            if (!result.rows[0]) throw new Error("Bank account not found");

            return BankAccountMapper.toDomain(result.rows[0] as BankAccountModel);
        } catch (error) {
            throw new Error(`Failed to update bank account: ${error instanceof Error ? error.message : error}`);
        }
    }
}