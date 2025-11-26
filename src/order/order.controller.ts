import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import type { ICartItem, ITopping } from "./order.types.js";
import type OrderService from "./order.service.js";
import type { Logger } from "winston";
import ApiResponse from "../common/utils/apiResponse.js";
import fetchWithCache from "../common/utils/fetchWithCache.js";
import type { IProductCache } from "../productCache/productCache.types.js";
import type { IToppingCache } from "../toppingCache/toppingCache.types.js";
import type CouponService from "../coupon/coupon.service.js";

export default class OrderController {
    constructor(
        private orderService: OrderService,
        private couponService: CouponService,
        private logger: Logger
    ) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            const error = createHttpError(400, result.array()[0]?.msg);
            next(error);
            return;
        }

        const {
            cart,
            customerId,
            address,
            paymentMode,
            comment,
            tenantId,
            couponCode,
        } = req.body;

        // Calculate the finalAmount of the cart
        const totalPrice = await this.calculateCartTotalAmount(cart);
        const coupon = await this.couponService.findOne({
            code: couponCode,
            tenantId: Number(tenantId),
        });
        let discountPercentage = 0;

        if (coupon) {
            const currDate = new Date();
            const couponDate = new Date(coupon.validUpto);

            if (currDate <= couponDate) {
                discountPercentage = coupon.discount;
            }
        }

        const priceAfterDiscount =
            totalPrice - Math.round((totalPrice * discountPercentage) / 100);

        // Currently hard coding tax to 18%
        // TODO: need to decide a logic for tax
        const taxes = Math.round((priceAfterDiscount * 18) / 100);

        // TODO: need to decide of a logic based on each tenant
        const deliveryCharges = 100;

        const finalTotalAmount = priceAfterDiscount + taxes + deliveryCharges;

        return res.status(200).json(
            new ApiResponse(200, "", {
                finalTotalAmount
            })
        );
    };

    private async calculateCartTotalAmount(cart: ICartItem[]): Promise<number> {
        const productIds = cart.map((item: ICartItem) => item._id);

        const allProductDetails = await fetchWithCache({
            ids: productIds,
            cacheFetchFn: this.orderService.getExitingProductDetails,
            remoteFetchFn: this.orderService.getMissingProductDetails,
            getId: (record: IProductCache) => record.productId.toString(),
        });

        const toppingIds = cart.flatMap((item) =>
            item.chosenConfiguration.selectedToppings.map(
                (topping) => topping._id
            )
        );

        const allToppingDetails = await fetchWithCache({
            ids: toppingIds,
            cacheFetchFn: this.orderService.getExistingToppingDetails,
            remoteFetchFn: this.orderService.getMissingToppingDetails,
            getId: (record: IToppingCache) => record.toppingId.toString(),
        });

        return cart.reduce((acc: number, item: ICartItem) => {
            return (
                acc +
                this.getItemPrice(item, allProductDetails, allToppingDetails)
            );
        }, 0);
    }

    private getItemPrice(
        item: ICartItem,
        allProductDetails: IProductCache[],
        allToppingDetails: IToppingCache[]
    ) {
        const currProduct = allProductDetails.find(
            (product) => product.productId === item._id
        );

        const productPrice = Object.entries(
            item.chosenConfiguration.priceConfiguration
        ).reduce((acc: number, [key, value]) => {
            return (
                acc +
                (currProduct?.priceConfiguration[key]?.availableOptions[
                    value
                ] ?? 0)
            );
        }, 0);

        const toppingPrice = item.chosenConfiguration.selectedToppings.reduce(
            (acc: number, currTopping: ITopping) => {
                return (
                    acc +
                    (allToppingDetails.find(
                        (topping) => topping.toppingId === currTopping._id
                    )?.price ?? 0)
                );
            },
            0
        );

        return productPrice + toppingPrice;
    }
}
