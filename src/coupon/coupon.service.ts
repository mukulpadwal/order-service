import CouponModel from "./coupon.model.js";
import type { ICoupon } from "./coupon.types.js";

class CouponService {
    async create({ title, code, discount, validUpto, tenantId }: ICoupon) {
        return await CouponModel.create({
            title,
            code,
            discount,
            validUpto,
            tenantId,
        });
    }
}

export default CouponService;
