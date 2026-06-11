import { User } from "../../domain/entities/user.entity.js";
import { UserId } from "../../domain/value-objects/UserId.vo.js";
import { Username } from "../../domain/value-objects/username.vo.js";
import { PasswordHash } from "../../domain/value-objects/password-hash.vo.js";
import { SecurityLevel } from "../../domain/value-objects/security-level.vo.js";
import { ClearanceLevel } from "../../domain/value-objects/clereance-level.vo.js";
import { IntegrityLevel } from "../../domain/value-objects/integrity-level.vo.js";

import type { UserModel } from "../models/user.model.js";


export class UserMapper {

    static toDomain(model: UserModel): User {
        return User.fromPersistence(
            UserId.fromString(model.uuid),
            new Username(model.username),
            new PasswordHash(model.password_hash),
            new SecurityLevel(
                UserMapper.toClearanceLevel(model.clearance_level),
                UserMapper.toIntegrityLevel(model.integrity_level)
            )
        );
    }

    static toPersistence(user: User): UserModel {
        return {
            uuid: user.getId().getValue(),
            username: user.getUsername().getUsername(),
            password_hash: user.getPasswordHash().getValue(),
            clearance_level: user.getSecurityLevel().getClearance(),
            integrity_level: UserMapper.toIntegrityLevelNumber(
                user.getSecurityLevel().getIntegrity()
            )
        };
    }

    private static toClearanceLevel(value: string): ClearanceLevel {
        if (!Object.values(ClearanceLevel).includes(value as ClearanceLevel)) {
            throw new Error("Invalid clearance level from database");
        }

        return value as ClearanceLevel;
    }

    private static toIntegrityLevel(value: number): IntegrityLevel {
        switch (value) {
            case 1:
                return IntegrityLevel.LEVEL_1;
            case 2:
                return IntegrityLevel.LEVEL_2;
            case 3:
                return IntegrityLevel.LEVEL_3;
            default:
                throw new Error("Invalid integrity level from database");
        }
    }

    private static toIntegrityLevelNumber(value: IntegrityLevel): number {
        switch (value) {
            case IntegrityLevel.LEVEL_1:
                return 1;
            case IntegrityLevel.LEVEL_2:
                return 2;
            case IntegrityLevel.LEVEL_3:
                return 3;
            default:
                throw new Error("Invalid integrity level");
        }
    }



}