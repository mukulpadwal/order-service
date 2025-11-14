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
