import { Decimal } from "decimal.js";
import { Transaction } from "../../domain/entities/transaction.entity.js";
import { TransactionId } from "../../domain/value-objects/transaction-id.vo.js";
import { AccountId } from "../../../BankAccount/domain/value-objects/account-id.vos.js";
import { Money } from "../../../BankAccount/domain/value-objects/money.vo.js";
import { TransactionStatus } from "../../domain/value-objects/transaction-status.vo.js";
import { RejectionReason } from "../../domain/value-objects/rejection-reason.vo.js";
import { CreatedAt } from "../../domain/value-objects/created-at.vo.js";
import type { TransactionModel } from "../models/transaction.model.js";

export class TransactionMapper {
    static toDomain(model: TransactionModel): Transaction {
        return Transaction.fromPersistence(
            new TransactionId(model.uuid),
            new AccountId(model.account_remitter_uuid),
            new AccountId(model.account_receiver_uuid),
            new Money(new Decimal(model.amount)),
            model.status as TransactionStatus,
            new RejectionReason(model.rejection_reason),
            CreatedAt.from(model.created_at)
        );
    }

    static toPersistence(transaction: Transaction): TransactionModel {
        return {
            uuid: transaction.getTransactionId().getValue(),
            account_remitter_uuid: transaction.getRemitterAccountId().getValue(),
            account_receiver_uuid: transaction.getReceiverAccountId().getValue(),
            amount: transaction.getMoney().getValue().toString(),
            status: transaction.getStatus(),
            rejection_reason: transaction.getRejectionReason().getValue(),
            created_at: transaction.getCreatedAt().getValue()
        };
    }
}