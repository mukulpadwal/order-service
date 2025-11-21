import cookieParser from "cookie-parser";
import express from "express";
import customerRouter from "./customer/customer.route.js";
import couponRouter from "./coupon/coupon.route.js";
import orderRouter from "./order/order.route.js";
import globalErrorHandler from "./common/middlewares/globalErrorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/order", orderRouter);

app.use(globalErrorHandler);

export default app;
