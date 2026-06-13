import { AppError } from "../../../shared/errors/app.error.js";
import type { BankAccountRepository } from "../../domain/repositories/bank-account.repository.js";
import { BankAccount } from "../../domain/entities/bank-account.entity.js";
import { OwnerId } from "../../domain/value-objects/owner-id.js";

export class FindBankAccountByOwnerIdUseCase {
    constructor(
        private readonly bankAccountRepository: BankAccountRepository
    ) {}

    async execute(ownerUuid: string): Promise<BankAccount> {
        const ownerId = new OwnerId(ownerUuid);
        const bankAccount = await this.bankAccountRepository.findByOwnerId(ownerId);

        if (!bankAccount) {
            throw new AppError(`Bank account for owner ${ownerUuid} not found`, 404);
        }

        return bankAccount;
    }
}