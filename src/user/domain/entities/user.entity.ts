import { UserId } from "../value-objects/UserId.vo.js";
import { Username } from "../value-objects/username.vo.js";
import { PasswordHash } from "../value-objects/password-hash.vo.js";
import { SecurityLevel } from "../value-objects/security-level.vo.js";

export class User {
    private constructor(
        private readonly id: UserId,
        private username: Username,
        private passwordHash: PasswordHash,
        private securityLevel: SecurityLevel
    ) {}

    static create(
        username: Username,
        passwordHash: PasswordHash,
        securityLevel: SecurityLevel
    ): User {
        return new User(
            UserId.create(),
            username,
            passwordHash,
            securityLevel
        );
    }

    static fromPersistence(
        id: UserId,
        username: Username,
        passwordHash: PasswordHash,
        securityLevel: SecurityLevel
    ): User {
        return new User(
            id,
            username,
            passwordHash,
            securityLevel
        );
    }

    getId(): UserId {
        return this.id;
    }

    getUsername(): Username {
        return this.username;
    }

    getPasswordHash(): PasswordHash {
        return this.passwordHash;
    }

    getSecurityLevel(): SecurityLevel {
        return this.securityLevel;
    }

    changeUsername(username: Username): void {
        this.username = username;
    }

    changePasswordHash(passwordHash: PasswordHash): void {
        this.passwordHash = passwordHash;
    }

    changeSecurityLevel(securityLevel: SecurityLevel): void {
        this.securityLevel = securityLevel;
    }

    sameIdentityAs(other: User): boolean {
        return this.id.equals(other.id);
    }
}