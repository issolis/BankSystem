import { AppError } from "../../shared/errors/app.error.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";
import { User } from "../../domain/entities/user.entity.js";
import { UserId } from "../../domain/value-objects/UserId.vo.js";

export class FindUserByIdUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async execute(id: string): Promise<User> {
        const userId = UserId.fromString(id);

        console.log(userId)

        const user = await this.userRepository.findById(userId);

        console.log(user)
        if (!user) {
            throw new AppError(`User with id ${id} not found`, 404);
        }

        return user;
    }
}