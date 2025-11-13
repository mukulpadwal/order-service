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

    async addAddress({
        address,
        userId,
        customerId,
    }: {
        address: string;
        userId: string;
        customerId: string | undefined;
    }) {
        return await CustomerModel.findOneAndUpdate(
            {
                _id: customerId,
                userId,
            },
            {
                $push: {
                    addresses: {
                        address,
                        isDefault: false,
                    },
                },
            },
            { new: true }
        );
    }
}

export default CustomerService;
