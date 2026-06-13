import { AppError } from "../../../shared/errors/app.error.js";
import type { BankAccountRepository } from "../../domain/repositories/bank-account.repository.js";
import { BankAccount } from "../../domain/entities/bank-account.entity.js";
import { AccountId } from "../../domain/value-objects/account-id.vos.js";

export class FindBankAccountByIdUseCase {
    constructor(
        private readonly bankAccountRepository: BankAccountRepository
    ) {}

    async execute(uuid: string): Promise<BankAccount> {
        const accountId = new AccountId(uuid);
        const bankAccount = await this.bankAccountRepository.findById(accountId);

        if (!bankAccount) {
            throw new AppError(`Bank account with id ${uuid} not found`, 404);
        }

        return bankAccount;
    }
}