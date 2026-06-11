export interface UserModel {
    uuid: string;
    username: string;
    password_hash: string;
    clearance_level: string;
    integrity_level: number;
}