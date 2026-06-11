import { User } from "../entities/user.entity.js";
import { UserId } from "../value-objects/UserId.vo.js";
import { Username } from "../value-objects/username.vo.js";

export interface UserRepository{
    findById(id: UserId): Promise<User | null>; 
    findByUsername(username: Username): Promise<User | null>; 
    findAllUsers(): Promise<User[] | []>; 
    save(user: User): Promise<void>; 
}