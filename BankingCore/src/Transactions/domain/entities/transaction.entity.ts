import { TransactionId } from "../value-objects/transaction-id.vo.js";
import { AccountId } from "../../../BankAccount/domain/value-objects/account-id.vos.js";
import { Money } from "../../../BankAccount/domain/value-objects/money.vo.js";
import { TransactionStatus } from "../value-objects/transaction-status.vo.js";
import { RejectionReason } from "../value-objects/rejection-reason.vo.js";
import { CreatedAt } from "../value-objects/created-at.vo.js";

export class Transaction {
    constructor(
        private readonly transactionId: TransactionId,
        private readonly remitterAccountId: AccountId,
        private readonly receiverAccountId: AccountId,
        private readonly money: Money,
        private readonly status: TransactionStatus,
        private readonly rejectionReason: RejectionReason,
        private readonly createdAt: CreatedAt
    ) {}

    static create(
        remitterAccountId: AccountId,
        receiverAccountId: AccountId,
        money: Money,
        status: TransactionStatus,
        rejectionReason: RejectionReason
    ): Transaction {
        return new Transaction(
            TransactionId.create(),
            remitterAccountId,
            receiverAccountId,
            money,
            status,
            rejectionReason,
            CreatedAt.now()
        );
    }

    static fromPersistence(
        transactionId: TransactionId,
        remitterAccountId: AccountId,
        receiverAccountId: AccountId,
        money: Money,
        status: TransactionStatus,
        rejectionReason: RejectionReason,
        createdAt: CreatedAt
    ): Transaction {
        return new Transaction(
            transactionId,
            remitterAccountId,
            receiverAccountId,
            money,
            status,
            rejectionReason,
            createdAt
        );
    }

    getTransactionId(): TransactionId {
        return this.transactionId;
    }

    getRemitterAccountId(): AccountId {
        return this.remitterAccountId;
    }

    getReceiverAccountId(): AccountId {
        return this.receiverAccountId;
    }

    getMoney(): Money {
        return this.money;
    }

    getStatus(): TransactionStatus {
        return this.status;
    }

    getRejectionReason(): RejectionReason {
        return this.rejectionReason;
    }

    getCreatedAt(): CreatedAt {
        return this.createdAt;
    }
}