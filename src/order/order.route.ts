import { Router } from "express";
import { authenticate } from "../common/middlewares/index.js";
import OrderController from "./order.controller.js";
import asyncWrapper from "../common/utils/asyncWrapper.js";
import createOrderValidator from "./createOrder.validator.js";
import OrderService from "./order.service.js";
import { logger } from "../config/index.js";
import CouponService from "../coupon/coupon.service.js";

const orderRouter = Router();
const orderService = new OrderService();
const copuponService = new CouponService();
const orderController = new OrderController(orderService, copuponService, logger);

orderRouter.post(
    "/create",
    authenticate,
    createOrderValidator,
    asyncWrapper(orderController.create)
);

export default orderRouter;
