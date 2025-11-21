import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export default class OrderController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            const error = createHttpError(400, result.array()[0]?.msg);
            next(error);
            return;
        }
    };
}
