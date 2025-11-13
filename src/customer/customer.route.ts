import { Router } from "express";
import { authenticate } from "../common/middlewares/index.js";
import { asyncWrapper } from "../common/utils/index.js";
import CustomerController from "./customer.controller.js";
import CustomerService from "./customer.service.js";
import { logger } from "../config/index.js";

const customerRouter = Router();
const customerService = new CustomerService();
const customerController = new CustomerController(customerService, logger);

// Protected Routes
customerRouter.get("/", authenticate, asyncWrapper(customerController.getCustomer))

export default customerRouter;