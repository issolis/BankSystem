import { randomUUID } from "crypto";

export class AssetId {
    constructor(
        private readonly value: string
    ) {
        if (!value || !value.trim()) {
            throw new Error("Asset id cannot be empty");
        }

        if (!AssetId.isValidUuid(value)) {
            throw new Error("Asset id must be a valid UUID");
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: AssetId): boolean {
        return this.value === other.value;
    }

    static create(): AssetId {
        return new AssetId(randomUUID());
    }

    private static isValidUuid(value: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    }
}