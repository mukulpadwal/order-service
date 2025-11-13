import mongoose from "mongoose";
import type { IAddress, ICustomer } from "./customer.types.js";
const { Schema, model } = mongoose;

const addressSchema = new Schema<IAddress>(
    {
        address: {
            type: String,
            required: true,
        },
        isDefault: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { _id: false }
);

const customerSchema = new Schema<ICustomer>(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
            unqiue: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        addresses: {
            type: [addressSchema],
            required: false,
        },
    },
    { timestamps: true }
);

const CustomerModel = model("customer", customerSchema);
export default CustomerModel;
