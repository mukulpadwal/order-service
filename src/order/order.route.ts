import { Router } from "express";
import { authenticate } from "../common/middlewares/index.js";
import OrderController from "./order.controller.js";
import asyncWrapper from "../common/utils/asyncWrapper.js";
import createOrderValidator from "./createOrder.validator.js";
import OrderService from "./order.service.js";
import { logger } from "../config/index.js";

const orderRouter = Router();
const orderService = new OrderService();
const orderController = new OrderController(orderService, logger);

orderRouter.post(
    "/create",
    authenticate,
    createOrderValidator,
    asyncWrapper(orderController.create)
);

export default orderRouter;
