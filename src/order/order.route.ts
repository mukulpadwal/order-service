import { Router } from "express";
import { authenticate } from "../common/middlewares/index.js";
import OrderController from "./order.controller.js";
import asyncWrapper from "../common/utils/asyncWrapper.js";
import createOrderValidator from "./createOrder.validator.js";

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.post(
    "/create",
    authenticate,
    createOrderValidator,
    asyncWrapper(orderController.create)
);

export default orderRouter;
