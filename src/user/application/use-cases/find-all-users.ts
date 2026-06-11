import type { UserRepository } from "../../domain/repositories/user.repository.js";

export class FindAllUsersUseCase{
    constructor(
        private readonly userRepository: UserRepository
    ){}

    async execute(){
        const users = await this.userRepository.findAllUsers(); 
        return users; 
    }
}