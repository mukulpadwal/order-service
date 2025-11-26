import type mongoose from "mongoose";

export interface IAttribute {
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface IPriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: string[];
    };
}

export interface ICategory {
    _id: string;
    name: string;
    priceConfiguration: IPriceConfiguration;
    attributes: IAttribute[];
    hasToppings: boolean;
}

export interface IProductAttribute {
    name: string;
    value: unknown;
}

export interface IProductPriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: Record<string, number>;
    };
}

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    image: string;
    priceConfiguration: IProductPriceConfiguration;
    attributes: IProductAttribute[];
    tenantId: string;
    categoryId: string;
    category: ICategory;
    isPublished: boolean;
}

export interface ITopping {
    _id: string;
    name: string;
    image: string;
    price: number;
    tenantId: string;
    isPublished?: boolean;
}

export interface ICartItem
    extends Pick<IProduct, "_id" | "name" | "image" | "priceConfiguration"> {
    chosenConfiguration: {
        priceConfiguration: {
            [key: string]: string;
        };
        selectedToppings: ITopping[];
    };
    quantity: number;
    itemHash?: string;
}

export enum PaymentMode {
    CARD = "card",
    CASH = "cash",
}

export enum OrderStatus {
    RECEIVED = "received",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    READY_FOR_DELIVERY = "ready_for_delivery",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUND = "refund",
}

export interface IOrder {
    cart: ICartItem[];
    customerId: mongoose.Types.ObjectId;
    totalAmount: number;
    discountAmount: number;
    appliedCoupon?: string;
    taxes: number;
    deliveryCharges: number;
    address: string;
    tenantId: string;
    comment?: string;
    paymentMode: PaymentMode;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentReferenceId?: string;
}
