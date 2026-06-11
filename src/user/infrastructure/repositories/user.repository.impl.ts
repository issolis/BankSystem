import { Pool } from "pg";
import pool from "../database/postgres.database.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";
import { User } from "../../domain/entities/user.entity.js";
import { UserId } from "../../domain/value-objects/UserId.vo.js";
import { Username } from "../../domain/value-objects/username.vo.js";
import type { UserModel } from "../models/user.model.js";
import { UserMapper } from "../mappers/user.mapper.js";


export class UserRepositoryImpl implements UserRepository{

    constructor(
        private readonly db: Pool = pool
    ){}

    async findById(id: UserId): Promise<User | null> {
        const id_value = id.getValue(); 

        const result = await this.db.query(`
            SELECT * 
            FROM users
            WHERE users.id = $1
            `, 
            [id_value]
        ); 
        
        throw new Error("Method not implemented.");
    }
    findByUsername(username: Username): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    save(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}