import type { UserRepository } from "../../../user/domain/repositories/user.repository.js";
import type { Password } from "../../../user/domain/value-objects/password.vo.js";
import type { Username } from "../../../user/domain/value-objects/username.vo.js";
import { AuthService } from "../../domain/services/auth.service.js";
import { AppError } from "../../../shared/errors/app.error.js";
import bcrypt from "bcrypt";

export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService
    ) { }

    async execute(username: Username, password: Password) {


        const user = await this.userRepository.findByUsername(username);

        if (!user) {
            throw new AppError("Invalid credentials", 401);
        }

        const isValid = await bcrypt.compare(password.getValue(), user.getPasswordHash().getValue()); 

        if (!isValid) throw new AppError("Invalid credentials", 401);

        return this.authService.generateToken(user);
    }
}