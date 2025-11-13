import CustomerModel from "./customer.model.js";
import type { ICustomer } from "./customer.types.js";

class CustomerService {
    async findOne({ userId }: Pick<ICustomer, "userId">) {
        return await CustomerModel.findOne({ userId });
    }

    async create({ userId, firstName, lastName, email, addresses }: ICustomer) {
        return await CustomerModel.create({
            userId,
            firstName,
            lastName,
            email,
            addresses,
        });
    }
}

export default CustomerService;
