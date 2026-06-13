import { OwnerId } from "../value-objects/owner-id.js";
import { AccountId } from "../value-objects/account-id.vos.js";
import { Money } from "../value-objects/money.vo.js";

export class BankAccount {
    constructor(
        private readonly ownerId: OwnerId,
        private readonly accountId: AccountId,
        private money: Money
    ) {}

    static create(
        ownerId: OwnerId,
        money: Money
    ): BankAccount {
        return new BankAccount(
            ownerId,
            AccountId.create(),
            money
        );
    }

    static fromPersistence(
        ownerId: OwnerId,
        accountId: AccountId,
        money: Money
    ): BankAccount {
        return new BankAccount(
            ownerId,
            accountId,
            money
        );
    }

    getMoney(): Money {
        return this.money;
    }

    getAccountId(): AccountId {
        return this.accountId;
    }

    getOwnerId(): OwnerId {
        return this.ownerId;
    }

    updateBalance(money: Money): void {
        this.money = money;
    }
}