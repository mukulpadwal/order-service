import mongoose from "mongoose";
import {
    PaymentStatus,
    OrderStatus,
    PaymentMode,
    type ICartItem,
    type IOrder,
    type ITopping,
} from "./order.types.js";

const { Schema, model } = mongoose;

const toppingSchema = new Schema<ITopping>(
    {
        _id: {
            type: String,
            required: true,
        },
        name: String,
        image: String,
        price: Number,
        tenantId: String,
        isPublished: Boolean,
    },
    { _id: false }
);

const cartSchema = new Schema<ICartItem>(
    {
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        priceConfiguration: {
            type: Map,
            of: {
                priceType: {
                    type: String,
                    enum: ["base", "additional"],
                    required: true,
                },
                availableOptions: {
                    type: Map,
                    of: Number,
                    required: true,
                },
            },
        },
        chosenConfiguration: {
            type: Object,
            of: {
                priceConfiguration: {
                    type: Map,
                    of: String,
                },
                selectedToppings: {
                    type: [toppingSchema],
                },
            },
        },
        quantity: {
            type: Number,
            required: true,
        },
        itemHash: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new Schema<IOrder>(
    {
        cart: {
            type: [cartSchema],
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        deliveryCharges: {
            type: Number,
            required: true,
        },
        taxes: {
            type: Number,
            required: true,
        },
        discountAmount: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        appliedCoupon: {
            type: String,
        },
        tenantId: {
            type: String,
            required: true,
        },
        orderStatus: {
            type: String,
            enum: OrderStatus,
        },
        paymentMode: {
            type: String,
            enum: PaymentMode,
        },
        paymentStatus: {
            type: String,
            enum: PaymentStatus,
        },
        paymentReferenceId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const OrderModel = model("Order", orderSchema);
export default OrderModel;
