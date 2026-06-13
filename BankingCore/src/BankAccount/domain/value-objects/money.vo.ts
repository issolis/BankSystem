import { Decimal } from "decimal.js";

export class Money {
    constructor(
        private readonly value: Decimal
    ) {
        if (value.isNegative()) {
            throw new Error("Money value cannot be negative");
        }
    }

    getValue(): Decimal {
        return this.value;
    }

    add(other: Money): Money {
        return new Money(this.value.plus(other.value));
    }

    subtract(other: Money): Money {
        const result = this.value.minus(other.value);
        if (result.isNegative()) {
            throw new Error("Money value cannot be negative");
        }
        return new Money(result);
    }

    isGreaterThanOrEqualTo(other: Money): boolean {
        return this.value.greaterThanOrEqualTo(other.value);
    }

    equals(other: Money): boolean {
        return this.value.equals(other.value);
    }

    static from(value: number | string): Money {
        return new Money(new Decimal(value));
    }
}