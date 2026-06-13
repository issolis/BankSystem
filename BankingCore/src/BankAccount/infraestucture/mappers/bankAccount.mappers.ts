import { Decimal } from "decimal.js";
import { BankAccount } from "../../domain/entities/bank-account.entity.js";
import { AccountId } from "../../domain/value-objects/account-id.vos.js";
import { Money } from "../../domain/value-objects/money.vo.js";
import { OwnerId } from "../../domain/value-objects/owner-id.js";
import type { BankAccountModel } from "../models/bankAccount.model.js";


export class BankAccountMapper {
    static toDomain(bankAccountModel: BankAccountModel): BankAccount {
        return BankAccount.fromPersistence(
            new OwnerId(bankAccountModel.owner_uuid),
            new AccountId(bankAccountModel.uuid),
            new Money(new Decimal(bankAccountModel.balance))
        );
    }

    static toPersistence(bankAccount: BankAccount): BankAccountModel {
        return {
            uuid: bankAccount.getAccountId().getValue(),
            owner_uuid: bankAccount.getOwnerId().getValue(),
            balance: bankAccount.getMoney().getValue().toString()
        };
    }
}