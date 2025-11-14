import type { NextFunction, Response } from "express";
import type CustomerService from "./customer.service.js";
import type { Logger } from "winston";
import { ApiResponse } from "../common/utils/index.js";
import type { Request } from "express-jwt";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import type { IAuthRequest } from "../common/types/index.js";

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
        } = (req as IAuthRequest).auth;

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

    addAddress = async (req: Request, res: Response, next: NextFunction) => {
        const { sub: userId } = (req as IAuthRequest).auth;
        const { customerId } = req.params;

        this.logger.info("Request to add address.", {
            customerId,
            userId,
        });

        if (!mongoose.Types.ObjectId.isValid(customerId as string)) {
            const error = createHttpError(400, "Invalid Customer Id");
            next(error);
            return;
        }

        const { address } = req.body;

        if (!address.trim()) {
            const error = createHttpError(
                400,
                "Kindly provide a valid address."
            );
            next(error);
            return;
        }

        const customer = await this.customerService.addAddress({
            address,
            userId,
            customerId,
        });

        if (!customer) {
            const error = createHttpError(404, "Customer not found.");
            next(error);
            return;
        }

        this.logger.info("Address added successfully.", {
            customerId: customer._id,
        });

        return res
            .status(200)
            .json(new ApiResponse(200, "Address Updated.", customer));
    };
}

export default CustomerController;
