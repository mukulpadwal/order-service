import { body } from "express-validator";

export default [
    body("cart")
        .exists()
        .withMessage("Cart is required")
        .isArray({ min: 1 })
        .withMessage("Empty cart sent."),

    body("customerId")
        .exists()
        .withMessage("Customer Id is required")
        .trim()
        .custom((value: string) => {
            if (!value.length) {
                return false;
            }

            return true;
        })
        .withMessage("Customer Id cannot be empty.")
        .isString()
        .withMessage("Customer Id should be a string"),

    body("address")
        .exists()
        .withMessage("Address is required")
        .trim()
        .custom((value: string) => {
            if (!value.length) {
                return false;
            }

            return true;
        })
        .withMessage("Address should not be empty.")
        .isString()
        .withMessage("Address should be a string"),

    body("paymentMode")
        .exists()
        .toLowerCase()
        .withMessage("Payment Mode is required")
        .custom((value: "cash" | "card") => {
            if (!["cash", "card"].includes(value)) {
                return false;
            }

            return true;
        })
        .withMessage("Payment mode can only be either cash or card."),

    body("tenantId")
        .exists()
        .withMessage("Tenant Id is required")
        .trim()
        .custom((value: string) => {
            if (!value.length) {
                return false;
            }

            return true;
        })
        .withMessage("Tenant Id should not be empty.")
        .isString()
        .withMessage("Tenant Id must be a string"),

    body("couponCode")
        .optional()
        .isString()
        .withMessage("CouponCode must be a string"),

    body("comment")
        .optional()
        .isString()
        .withMessage("Comment must be a string"),
];
