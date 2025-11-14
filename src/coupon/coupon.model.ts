import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import type { ICoupon } from "./coupon.types.js";

const { Schema, model } = mongoose;

const couponSchema = new Schema<ICoupon>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            uppercase: true,
            unique: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        validUpto: {
            type: Date,
            required: true,
        },
        tenantId: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

couponSchema.plugin(mongooseAggregatePaginate);
couponSchema.index({ tenantId: 1, code: 1 }, { unique: true });

const CouponModel = model("coupon", couponSchema);
export default CouponModel;
