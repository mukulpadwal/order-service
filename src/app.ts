import cookieParser from "cookie-parser";
import express from "express";
import customerRouter from "./customer/customer.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/customer", customerRouter);

export default app;
