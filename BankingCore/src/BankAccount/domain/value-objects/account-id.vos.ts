import { randomUUID } from "crypto";

export class AccountId {

    constructor(
        private readonly value: string
    ) {
        if (!value || !value.trim()) {
            throw new Error("Account id cannot be empty");
        }

        if (!AccountId.isValidUuid(value)) {
            throw new Error("Account id must be a valid UUID");
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: AccountId): boolean {
        return this.value === other.value;
    }

    static create(): AccountId {
        return new AccountId(randomUUID());
    }

    private static isValidUuid(value: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    }
}