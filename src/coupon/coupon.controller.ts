import type { NextFunction, Request, Response } from "express";
import type CouponService from "./coupon.service.js";
import type { Logger } from "winston";
import type { IAuthRequest } from "../common/types/index.js";
import { Roles } from "../common/constants/index.js";
import createHttpError from "http-errors";
import ApiResponse from "../common/utils/apiResponse.js";
import mongoose from "mongoose";
import type { ICouponFilter } from "./coupon.types.js";

class CouponController {
    private couponService: CouponService;
    private logger: Logger;

    constructor(couponService: CouponService, logger: Logger) {
        this.couponService = couponService;
        this.logger = logger;
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        const { title, code, discount, validUpto, tenantId } = req.body;

        this.logger.info(`Request to create a coupon.`, {
            title,
            code,
            tenantId,
        });

        const authReq = (req as IAuthRequest).auth;

        // Manager Should Only be able to add it's tenant coupon
        if (
            authReq.role === Roles.MANAGER &&
            Number(authReq.tenantId) !== Number(tenantId)
        ) {
            const error = createHttpError(
                400,
                "You are not allowed to create coupon code for any other tenant."
            );
            next(error);
            return;
        }

        const coupon = await this.couponService.create({
            title,
            code,
            discount: Number(discount),
            validUpto: new Date(validUpto),
            tenantId: Number(tenantId),
        });

        if (!coupon) {
            const error = createHttpError(
                401,
                "Something went wrong while creating coupon."
            );
            next(error);
            return;
        }

        this.logger.info("Coupon created.", { id: coupon._id });

        return res
            .status(201)
            .json(new ApiResponse(201, "Coupon created.", coupon));
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        const { couponId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(couponId as string)) {
            const error = createHttpError(400, "Invalid couponId");
            next(error);
            return;
        }

        const { title, code, discount, validUpto, tenantId } = req.body;

        this.logger.info(`Request to update coupon.`, {
            couponId,
        });

        const authReq = (req as IAuthRequest).auth;

        // Manager Should Only be able to update it's tenant's coupon
        if (
            authReq.role === Roles.MANAGER &&
            Number(authReq.tenantId) !== Number(tenantId)
        ) {
            const error = createHttpError(
                401,
                "You are not allowed to update coupon details for any other tenant."
            );
            next(error);
            return;
        }

        const coupon = await this.couponService.update(couponId, {
            title,
            code,
            discount: Number(discount),
            validUpto: new Date(validUpto),
            tenantId: Number(tenantId),
        });

        if (!coupon) {
            const error = createHttpError(404, "Coupon not found.");
            next(error);
            return;
        }

        this.logger.info("Coupon updated.", { id: coupon._id });

        return res
            .status(200)
            .json(new ApiResponse(201, "Coupon updated.", coupon));
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { couponId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(couponId as string)) {
            const error = createHttpError(400, "Invalid couponId");
            next(error);
            return;
        }

        this.logger.info(`Request to delete coupon.`, {
            couponId,
        });

        const coupon = await this.couponService.findById(couponId);

        if (!coupon) {
            const error = createHttpError(404, "Coupon not found.");
            next(error);
            return;
        }

        const authReq = (req as IAuthRequest).auth;

        // Manager Should Only be able to update it's tenant's coupon
        if (
            authReq.role === Roles.MANAGER &&
            Number(authReq.tenantId) !== Number(coupon?.tenantId)
        ) {
            const error = createHttpError(
                401,
                "You are not allowed to delete coupon any other tenant."
            );
            next(error);
            return;
        }

        await this.couponService.delete(couponId);

        this.logger.info(`Coupon Deleted.`, {
            couponId,
        });

        return res.status(200).json(new ApiResponse(200, "Coupon deleted."));
    };

    getAll = async (req: Request, res: Response) => {
        const { q, discount, validUpto, tenantId, currentPage, perPage } =
            req.query;

        const filters: ICouponFilter = {};

        const authReq = (req as IAuthRequest).auth;

        if (tenantId && (tenantId as string).trim()) {
            if (authReq.role === Roles.MANAGER) {
                filters.tenantId = Number(authReq.tenantId);
            } else {
                filters.tenantId = Number(tenantId);
            }
        } else {
            if (authReq.role === Roles.MANAGER) {
                filters.tenantId = Number(authReq.tenantId);
            }
        }

        if (validUpto && (validUpto as string).trim()) {
            filters.validUpto = new Date(validUpto as unknown as Date);
        }

        if (discount && (discount as string).trim()) {
            filters.discount = Number(discount);
        }

        this.logger.info(
            `Request to list all coupons`,
            {
                q,
                discount,
                validUpto,
                tenantId,
                currentPage,
                perPage,
            },
            { filters }
        );

        const coupons = await this.couponService.getAll(q as string, filters, {
            page: currentPage ? parseInt(currentPage as string) : 1,
            limit: perPage ? parseInt(perPage as string) : 10,
        });

        return res
            .status(200)
            .json(new ApiResponse(200, "Coupons fetched.", coupons));
    };

    verify = async (req: Request, res: Response, next: NextFunction) => {
        const { code, tenantId } = req.body;

        if ([code, tenantId].some((field) => !field)) {
            const error = createHttpError(400, "Missing field values.");
            next(error);
            return;
        }

        this.logger.info("Requets to verify coupon", { code, tenantId });

        const coupon = await this.couponService.findOne({
            code,
            tenantId: Number(tenantId),
        });

        if (!coupon) {
            this.logger.info("Coupon Not Found.", { code, tenantId });
            const error = createHttpError(404, "Invalid Coupon.");
            next(error);
            return;
        }

        const currDate = new Date();
        const couponDate = new Date(coupon.validUpto);

        if (currDate <= couponDate) {
            this.logger.info("Coupon Verified", { code, tenantId });

            return res.status(200).json(
                new ApiResponse(200, "Valid Coupon", {
                    discount: coupon.discount,
                })
            );
        }

        this.logger.info("Coupon Expired", { code, tenantId });

        return res.status(200).json(
            new ApiResponse(200, "Token Expired.", {
                discount: 0,
            })
        );
    };
}

export default CouponController;
