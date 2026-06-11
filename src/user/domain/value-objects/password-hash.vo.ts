export class PasswordHash {
    constructor(
        private readonly value: string
    ) {
        if (!value) {
            throw new Error("Password hash cannot be empty");
        }
    }

    getValue(): string {
        return this.value;
    }
}