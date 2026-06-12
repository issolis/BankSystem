export class Password {
    constructor(
        private readonly value: string
    ) {
        if (!value) {
            throw new Error("Password cannot be empty");
        }

        if (value.length < 8) {
            throw new Error("Password must have at least 8 characters");
        }

        if (!/[A-Z]/.test(value)) {
            throw new Error("Password must contain at least one uppercase letter");
        }

        if (!/[a-z]/.test(value)) {
            throw new Error("Password must contain at least one lowercase letter");
        }

        if (!/[0-9]/.test(value)) {
            throw new Error("Password must contain at least one number");
        }
    }

    getValue(): string {
        return this.value;
    }
}