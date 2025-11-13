import type { Request } from "express-jwt";

export interface ICustomerRequest extends Request {
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

export interface IAddress {
    address: string;
    isDefault: boolean;
}

export interface ICustomer {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    addresses: IAddress[];
}
