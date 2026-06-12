import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { User } from "../../../user/domain/entities/user.entity.js";

const privateKey = fs.readFileSync(path.resolve("keys/private.pem"), "utf8");

export class AuthService {

    generateToken(user: User): string {
        const payload = {
            sub: user.getId().getValue(),
            username: user.getUsername().getUsername(),
            clearance_level: user.getSecurityLevel().getClearance(),
            integrity_level: user.getSecurityLevel().getIntegrity()
        };

        return jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h"
        });
    }
}