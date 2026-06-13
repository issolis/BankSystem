import { Decimal } from "decimal.js";

export class AssetValue {
    constructor(
        private readonly value: Decimal
    ) {
        if (value.isNegative()) {
            throw new Error("Asset value cannot be negative");
        }
    }

    getValue(): Decimal {
        return this.value;
    }

    equals(other: AssetValue): boolean {
        return this.value.equals(other.value);
    }

    static from(value: number | string): AssetValue {
        return new AssetValue(new Decimal(value));
    }
}