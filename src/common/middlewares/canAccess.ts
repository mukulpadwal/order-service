import type { NextFunction, Request, Response } from "express";
import type { Roles } from "../constants/index.js";
import type { IAuthRequest } from "../types/index.js";
import createHttpError from "http-errors";

type Role = (typeof Roles)[keyof typeof Roles];

const canAccess = (allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as IAuthRequest;
        const roleFromToken = _req.auth.role as Role;

        if (!allowedRoles.includes(roleFromToken)) {
            const error = createHttpError(
                403,
                "You don't have permission to access this route."
            );
            next(error);
            return;
        }

        next();
    };
};

export default canAccess;
