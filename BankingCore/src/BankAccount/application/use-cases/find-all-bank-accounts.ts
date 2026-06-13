import type { BankAccountRepository } from "../../domain/repositories/bank-account.repository.js";
import { BankAccount } from "../../domain/entities/bank-account.entity.js";

export class FindAllBankAccountsUseCase {
    constructor(
        private readonly bankAccountRepository: BankAccountRepository
    ) {}

    async execute(): Promise<BankAccount[]> {
        return await this.bankAccountRepository.findAll();
    }
}