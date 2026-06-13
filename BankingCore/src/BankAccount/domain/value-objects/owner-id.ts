import { randomUUID } from "crypto";

export class OwnerId {

    constructor(
        private readonly value: string
    ) {
        if (!value || !value.trim()) {
            throw new Error("Owner id cannot be empty");
        }

        if (!OwnerId.isValidUuid(value)) {
            throw new Error("Owner id must be a valid UUID");
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: OwnerId): boolean {
        return this.value === other.value;
    }

    private static isValidUuid(value: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    }
}