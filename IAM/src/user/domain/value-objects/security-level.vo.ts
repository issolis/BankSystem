import { ClearanceLevel } from "./clereance-level.vo.js";
import { IntegrityLevel } from "./integrity-level.vo.js";

export class SecurityLevel {
    constructor(
        private readonly clearance: ClearanceLevel, 
        private readonly integrity: IntegrityLevel
    ){}

    getClearance(): ClearanceLevel{
        return this.clearance
    }

    getIntegrity(): IntegrityLevel{
        return this.integrity
    }

    equals(other: SecurityLevel): boolean {
        return (
            this.clearance === other.clearance &&
            this.integrity === other.integrity
        );
    }
}