import mongoose from "mongoose";

import type {
    IPriceConfiguration,
    IProductCache,
} from "./productCache.types.js";

const { Schema, model } = mongoose;

const priceConfigurationSchema = new Schema<IPriceConfiguration>(
    {
        priceType: {
            type: String,
            enum: ["base", "additional"],
        },
        availableOptions: {
            type: Map,
            of: Number,
        },
    },
    { _id: false }
);

const productCacheSchema = new Schema<IProductCache>({
    productId: {
        type: String,
        required: true,
    },
    priceConfiguration: {
        type: Map,
        of: priceConfigurationSchema,
    },
});

const ProductCacheModel = model("productCache", productCacheSchema);
export default ProductCacheModel;
