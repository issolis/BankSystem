declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
                clearance_level: string;
                integrity_level: number;
                role: string;
            };
        }
    }
}

export {};