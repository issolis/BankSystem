import type { BankAccountRepository } from "../../../BankAccount/domain/repositories/bank-account.repository.js";
import type { TransactionRepository } from "../repositories/transaction.repository.js";
import { AccountId } from "../../../BankAccount/domain/value-objects/account-id.vos.js";
import { Money } from "../../../BankAccount/domain/value-objects/money.vo.js";
import { Transaction } from "../entities/transaction.entity.js";
import { TransactionStatus } from "../value-objects/transaction-status.vo.js";
import { RejectionReason } from "../value-objects/rejection-reason.vo.js";
import { AppError } from "../../../shared/errors/app.error.js";

export class TransactionProcessor {
    constructor(
        private readonly bankAccountRepository: BankAccountRepository,
        private readonly transactionRepository: TransactionRepository
    ) { }

    async process(
        remitterAccountUuid: string,
        receiverAccountUuid: string,
        amount: number,
        requesterIntegrityLevel: number
    ): Promise<Transaction> {

        const remitterAccountId = new AccountId(remitterAccountUuid);
        const remitterAccount = await this.bankAccountRepository.findById(remitterAccountId);
        if (!remitterAccount) {
            throw new AppError("Remitter account not found", 404);
        }

        const receiverAccountId = new AccountId(receiverAccountUuid);
        const receiverAccount = await this.bankAccountRepository.findById(receiverAccountId);
        if (!receiverAccount) {
            throw new AppError("Receiver account not found", 404);
        }


        const iamResponse = await fetch(
            `${process.env.IAM_URL}/users/${receiverAccount.getOwnerId().getValue()}`
        );
        if (!iamResponse.ok) {
            throw new AppError("Could not retrieve receiver owner data from IAM", 502);
        }

        const iamData = await iamResponse.json() as { data: { integrity_level: string } };

        const integrityLevelMap: Record<string, number> = {
            "LEVEL_1": 1,
            "LEVEL_2": 2,
            "LEVEL_3": 3
        };

        const receiverIntegrityLevel = integrityLevelMap[iamData.data.integrity_level] as number;

        console.log(requesterIntegrityLevel);
        console.log(receiverIntegrityLevel);

        if (requesterIntegrityLevel < receiverIntegrityLevel) {
            const transaction = Transaction.create(
                remitterAccountId,
                receiverAccountId,
                Money.from(amount),
                TransactionStatus.REJECTED,
                RejectionReason.of(
                    `Biba violation: requester integrity level ${requesterIntegrityLevel} is lower than receiver integrity level ${receiverIntegrityLevel}`
                )
            );
            return await this.transactionRepository.create(transaction);
        }

        const transferAmount = Money.from(amount);
        if (!remitterAccount.getMoney().isGreaterThanOrEqualTo(transferAmount)) {
            throw new AppError("Insufficient balance", 422);
        }

        remitterAccount.updateBalance(remitterAccount.getMoney().subtract(transferAmount));
        receiverAccount.updateBalance(receiverAccount.getMoney().add(transferAmount));

        await this.bankAccountRepository.update(remitterAccount);
        await this.bankAccountRepository.update(receiverAccount);

        const transaction = Transaction.create(
            remitterAccountId,
            receiverAccountId,
            transferAmount,
            TransactionStatus.COMPLETED,
            RejectionReason.none()
        );

        return await this.transactionRepository.create(transaction);
    }
}