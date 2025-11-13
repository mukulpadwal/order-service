import type { Response } from "express";
import type CustomerService from "./customer.service.js";
import type { Logger } from "winston";
import { ApiResponse } from "../common/utils/index.js";
import type { Request } from "express-jwt";
import type { ICustomerRequest } from "./customer.types.js";

class CustomerController {
    private customerService: CustomerService;
    private logger: Logger;

    constructor(customerService: CustomerService, logger: Logger) {
        this.customerService = customerService;
        this.logger = logger;
    }

    getCustomer = async (req: Request, res: Response) => {
        const {
            sub: userId,
            firstName,
            lastName,
            email,
        } = (req as ICustomerRequest).auth;

        this.logger.info("Request to fetch customer details.", {
            userId,
            firstName,
            lastName,
            email,
        });

        const customer = await this.customerService.findOne({ userId });

        if (!customer) {
            const newCustomer = await this.customerService.create({
                userId,
                firstName,
                lastName,
                email,
                addresses: [],
            });

            this.logger.info("Customer details fetched.", {
                userId: newCustomer.userId,
            });

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Customer Details Fetched",
                        newCustomer
                    )
                );
        }

        this.logger.info("Customer details fetched.", {
            userId: customer.userId,
        });

        return res
            .status(200)
            .json(new ApiResponse(200, "Customer Details Fetched", customer));
    };
}

export default CustomerController;
