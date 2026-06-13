import type { BankAccount } from "../entities/bank-account.entity.js";
import { AccountId } from "../value-objects/account-id.vos.js";
import { OwnerId } from "../value-objects/owner-id.js";


export interface BankAccountRepository {
    findById(accountId: AccountId): Promise<BankAccount | null>;
    findByOwnerId(ownerId: OwnerId): Promise<BankAccount | null>;
    findAll(): Promise<BankAccount[]>;
    create(bankAccount: BankAccount): Promise<BankAccount>;
    update(bankAccount: BankAccount): Promise<BankAccount>;
}