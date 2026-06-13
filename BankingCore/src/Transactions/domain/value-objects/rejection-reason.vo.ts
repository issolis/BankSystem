export class RejectionReason {
    constructor(
        private readonly value: string | null
    ) {
        if (value !== null && !value.trim()) {
            throw new Error("Rejection reason cannot be empty string");
        }
    }

    getValue(): string | null {
        return this.value;
    }

    equals(other: RejectionReason): boolean {
        return this.value === other.value;
    }

    static none(): RejectionReason {
        return new RejectionReason(null);
    }

    static of(reason: string): RejectionReason {
        return new RejectionReason(reason);
    }
}