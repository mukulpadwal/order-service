import type { IPaginateQuery } from "../common/types/index.js";
import { paginateLabels } from "../config/index.js";
import CouponModel from "./coupon.model.js";
import type { ICoupon, ICouponFilter } from "./coupon.types.js";

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

    async delete(couponId: string | undefined) {
        return await CouponModel.findByIdAndDelete(couponId);
    }

    async findById(couponId: string | undefined) {
        return await CouponModel.findById(couponId);
    }

    async getAll(
        q: string,
        filters: ICouponFilter,
        paginateQuery: IPaginateQuery
    ) {
        const regExp = new RegExp(q, "i");

        const matchQueryParams = {
            ...filters,
            validUpto: {
                $gte: new Date().toISOString(),
                $lte: filters.validUpto,
            },
            title: regExp,
        };

        const aggregate = CouponModel.aggregate([
            {
                $match: matchQueryParams,
            },
        ]);

        const coupons = await (CouponModel as any).aggregatePaginate(
            aggregate,
            {
                ...paginateQuery,
                customLabels: paginateLabels,
            }
        );

        return coupons;
    }

    async findOne({ code, tenantId }: Pick<ICoupon, "code" | "tenantId">) {
        return await CouponModel.findOne({ code, tenantId });
    }
}

export default CouponService;
