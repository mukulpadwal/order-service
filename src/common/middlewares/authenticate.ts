import { expressjwt } from "express-jwt";
import config from "config";
import jwksClient from "jwks-rsa";
import type { Request } from "express";

const authenticate = expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: config.get("auth.jwksUri"),
        cache: true,
        rateLimit: true,
    }),
    algorithms: ["RS256"],
    getToken: function (req: Request) {
        // Getting token through authorization header if present
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.split(" ")[1] !== "undefined") {
            const token = authHeader.split(" ")[1];

            if (token) {
                return token;
            }
        }

        // Getting token through cookies if not present in headers
        const { accessToken } = req.cookies as Record<string, string>;
        return accessToken;
    },
});

export default authenticate;
