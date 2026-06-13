import { AppError } from "../../../shared/errors/app.error.js";
import type { BankAccountRepository } from "../../domain/repositories/bank-account.repository.js";
import { BankAccount } from "../../domain/entities/bank-account.entity.js";
import { OwnerId } from "../../domain/value-objects/owner-id.js";
import { Money } from "../../domain/value-objects/money.vo.js";

export class CreateBankAccountUseCase {
    constructor(
        private readonly bankAccountRepository: BankAccountRepository
    ) {}

    async execute(ownerUuid: string, initialBalance: number): Promise<BankAccount> {
        const response = await fetch(`${process.env.IAM_URL}/users/${ownerUuid}`);

        if (!response.ok) {
            throw new AppError("Owner not found in IAM", 404);
        }

        const ownerId = new OwnerId(ownerUuid);
        const money = Money.from(initialBalance);
        const bankAccount = BankAccount.create(ownerId, money);

        return await this.bankAccountRepository.create(bankAccount);
    }
}