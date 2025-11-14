import type { Request } from "express-jwt";

export interface IAuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id: string;
        tenantId: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface IPaginateQuery {
    page: number;
    limit: number;
}
