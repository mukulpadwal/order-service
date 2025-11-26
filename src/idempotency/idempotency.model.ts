import mongoose from "mongoose";
import type { IIdempotency } from "./idempotency.types.js";

const { Schema, model } = mongoose;

const idempotencySchema = new Schema<IIdempotency>(
    {
        key: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        response: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

idempotencySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 48 });

const IdempotencyModel = model("Idempotency", idempotencySchema);
export default IdempotencyModel;
