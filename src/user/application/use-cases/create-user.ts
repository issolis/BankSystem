import bcrypt from "bcrypt";
import type { UserRepository } from "../../domain/repositories/user.repository.js";
import { User } from "../../domain/entities/user.entity.js";
import { Username } from "../../domain/value-objects/username.vo.js";
import { Password } from "../../domain/value-objects/password.vo.js";
import { PasswordHash } from "../../domain/value-objects/password-hash.vo.js";
import { SecurityLevel } from "../../domain/value-objects/security-level.vo.js";
import { ClearanceLevel } from "../../domain/value-objects/clereance-level.vo.js";
import { IntegrityLevel } from "../../domain/value-objects/integrity-level.vo.js";

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async execute(
        username: string,
        password: string,
        clearanceLevel: ClearanceLevel,
        integrityLevel: IntegrityLevel
    ): Promise<User> {

        const usernameVO = new Username(username);
        const passwordVO = new Password(password);
        const hash = await bcrypt.hash(passwordVO.getValue(), 10);
        const passwordHashVO = new PasswordHash(hash);
        const securityLevel = new SecurityLevel(clearanceLevel, integrityLevel);

        const user = User.create(usernameVO, passwordHashVO, securityLevel);

        return await this.userRepository.create(user);
    }
}