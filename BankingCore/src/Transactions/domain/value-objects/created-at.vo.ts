export class CreatedAt {
    constructor(
        private readonly value: Date
    ) {}

    getValue(): Date {
        return this.value;
    }

    equals(other: CreatedAt): boolean {
        return this.value.getTime() === other.value.getTime();
    }

    static now(): CreatedAt {
        return new CreatedAt(new Date());
    }

    static from(date: Date): CreatedAt {
        return new CreatedAt(date);
    }
}