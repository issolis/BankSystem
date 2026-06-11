import { Pool } from "pg";
import pool from "../database/postgres.database.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";
import { User } from "../../domain/entities/user.entity.js";
import { UserId } from "../../domain/value-objects/UserId.vo.js";
import { Username } from "../../domain/value-objects/username.vo.js";
import type { UserModel } from "../models/user.model.js";
import { UserMapper } from "../mappers/user.mapper.js";

export class UserRepositoryImpl implements UserRepository {

    constructor(
        private readonly db: Pool = pool
    ) { }


    async findAllUsers(): Promise<User[] | []> {
        try {
            const result = await this.db.query(
                `SELECT uuid, username, password_hash, clearance_level, integrity_level
             FROM users`
            );

            return result.rows.map(row => UserMapper.toDomain(row as UserModel));

        } catch (error) {
            throw new Error(`Failed to find users: ${error instanceof Error ? error.message : error}`);
        }
    }

    async findById(id: UserId): Promise<User | null> {
        try {
            const result = await this.db.query(
                `SELECT uuid, username, password_hash, clearance_level, integrity_level
             FROM users
             WHERE uuid = $1`,
                [id.getValue()]
            );
            if (!result.rows[0]) return null;

            return UserMapper.toDomain(result.rows[0] as UserModel);

        } catch (error) {
            throw new Error(`Failed to find user by id: ${error instanceof Error ? error.message : error}`);
        }
    }
    async create(user: User): Promise<User> {
        try {
            const userDB = UserMapper.toPersistence(user);
            const result = await this.db.query(`
            INSERT INTO users
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
                [userDB.uuid, userDB.username, userDB.password_hash,
                userDB.clearance_level, userDB.integrity_level]
            );

            return UserMapper.toDomain(result.rows[0] as UserModel);

        } catch (error) {
            throw new Error(`Internal Error: ${error instanceof Error ? error.message : error}`);
        }
    }
    findByUsername(username: Username): Promise<User | null> {
        throw new Error("Method not implemented.");
    }


}