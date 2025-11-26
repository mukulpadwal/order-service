import type mongoose from "mongoose";
import IdempotencyModel from "./idempotency.model.js";
import type { IIdempotency } from "./idempotency.types.js";

export default class IdempotencyService {
    async findOne(key: string) {
        return await IdempotencyModel.findOne({ key: key }).lean();
    }

    async create(
        idempotencyPayload: IIdempotency,
        session: mongoose.ClientSession
    ) {
        return await IdempotencyModel.create([idempotencyPayload], { session });
    }
}
