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

    async update(
        couponId: string | undefined,
        { title, code, discount, validUpto, tenantId }: ICoupon
    ) {
        return await CouponModel.findByIdAndUpdate(
            couponId,
            {
                $set: {
                    title,
                    code,
                    discount,
                    validUpto,
                    tenantId,
                },
            },
            { new: true }
        );
    }
}

export default CouponService;
