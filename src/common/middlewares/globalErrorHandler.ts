import type { NextFunction, Request, Response } from "express";
import type { HttpError } from "http-errors";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../config/index.js";
import { ApiResponse } from "../utils/index.js";


const globalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const errorId = uuidv4();
    const statusCode = err.status ?? 500;

    const isProduction = process.env.NODE_ENV === "production";

    const message = isProduction ? "Internal Server Error" : err.message;

    logger.error(err.message, {
        id: errorId,
        statusCode,
        error: err.stack,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json(new ApiResponse(statusCode, message, null, [
        {
            ref: errorId,
            type: err.name,
            message: message,
            path: req.path,
            method: req.method,
            location: "server",
            stack: isProduction ? null : err.stack,
        },
    ]))
}

export default globalErrorHandler;