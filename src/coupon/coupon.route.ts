import { Router } from "express";
import { authenticate, canAccess } from "../common/middlewares/index.js";
import { asyncWrapper } from "../common/utils/index.js";
import { logger } from "../config/index.js";
import CouponService from "./coupon.service.js";
import CouponController from "./coupon.controller.js";
import { Roles } from "../common/constants/index.js";

const couponRouter = Router();
const couponService = new CouponService();
const couponController = new CouponController(couponService, logger);

// Private Routes
couponRouter.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    asyncWrapper(couponController.create)
);

couponRouter.patch(
    "/:couponId",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    asyncWrapper(couponController.update)
);

couponRouter.delete(
    "/:couponId",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    asyncWrapper(couponController.delete)
);

couponRouter.get(
    "/list",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    asyncWrapper(couponController.getAll)
);

// Public Routes
couponRouter.post("/verify", asyncWrapper(couponController.verify));

export default couponRouter;
