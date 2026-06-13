export class AssetName {
    constructor(
        private readonly value: string
    ) {
        if (!value || !value.trim()) {
            throw new Error("Asset name cannot be empty");
        }

        if (value.trim().length < 3) {
            throw new Error("Asset name must be at least 3 characters");
        }
    }

    getValue(): string {
        return this.value;
    }

    equals(other: AssetName): boolean {
        return this.value === other.value;
    }
}