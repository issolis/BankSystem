import { randomUUID } from "crypto";

export class UserId {
    private constructor(
        private readonly value: string
    ) {
        if (!value || !value.trim()) {
            throw new Error("User id cannot be empty");
        }

        if (!UserId.isValidUuid(value)) {
            throw new Error("User id must be a valid UUID");
        }
    }

    static create(): UserId {
        return new UserId(randomUUID());
    }

    static fromString(value: string): UserId {
        return new UserId(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: UserId): boolean {
        return this.value === other.value;
    }

    private static isValidUuid(value: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    }
}