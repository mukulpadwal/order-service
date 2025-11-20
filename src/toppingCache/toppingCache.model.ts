import mongoose from "mongoose";
import type { IToppingCache } from "./toppingCache.types.js";

const { Schema, model } = mongoose;

const toppingCacheSchema = new Schema<IToppingCache>(
    {
        toppingId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const ToppingCacheModel = model("toppingCache", toppingCacheSchema);
export default ToppingCacheModel;
