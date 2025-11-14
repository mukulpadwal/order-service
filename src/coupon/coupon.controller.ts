import type { Request, Response } from "express";
import type CouponService from "./coupon.service.js";
import type { Logger } from "winston";

class CouponController {
    private couponService: CouponService;
    private logger: Logger;

    constructor(couponService: CouponService, logger: Logger) {
        this.couponService = couponService;
        this.logger = logger;
    }

    create = async (req: Request, res: Response) => {};

    update = async (req: Request, res: Response) => {};

    delete = async (req: Request, res: Response) => {};

    getAll = async (req: Request, res: Response) => {};
    
    getSingle = async (req: Request, res: Response) => {};
}

export default CouponController;
