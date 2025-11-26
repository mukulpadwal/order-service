import ProductCacheModel from "../productCache/productCache.model.js";
import handleProductUpdate from "../productCache/productUpdateHandler.js";
import ToppingCacheModel from "../toppingCache/toppingCache.model.js";
import handleToppingUpdate from "../toppingCache/toppingUpdateHandler.js";
import OrderModel from "./order.model.js";
import type { IOrder } from "./order.types.js";

export default class OrderService {
    async getExitingProductDetails(productIds: string[]) {
        return await ProductCacheModel.find({
            productId: {
                $in: productIds,
            },
        }).lean();
    }

    async getMissingProductDetails(productIds: string[]) {
        if (!productIds.length) return [];

        const products = await Promise.all(
            productIds.map(async (productId) => {
                // TODO: Make this url dynamic
                const res = await fetch(
                    `http://localhost:8081/api/v1/product/${productId}`
                );

                if (!res.ok) return null;

                const { data } = await res.json();

                await handleProductUpdate(
                    JSON.stringify({
                        id: data._id,
                        priceConfiguration: data.priceConfiguration,
                    })
                );

                return ProductCacheModel.findOne({
                    productId: data._id,
                }).lean();
            })
        );

        return products.filter((product) => product !== null);
    }

    async getExistingToppingDetails(toppingIds: string[]) {
        return await ToppingCacheModel.find({
            toppingId: {
                $in: toppingIds,
            },
        }).lean();
    }

    async getMissingToppingDetails(toppingIds: string[]) {
        if (!toppingIds.length) return [];

        const toppings = await Promise.all(
            toppingIds.map(async (toppingId) => {
                // TODO: Make this url dynamic
                const res = await fetch(
                    `http://localhost:8081/api/v1/topping/${toppingId}`
                );

                if (!res.ok) return null;

                const { data } = await res.json();

                await handleToppingUpdate(
                    JSON.stringify({
                        id: data._id,
                        price: data.price,
                    })
                );

                return ToppingCacheModel.findOne({
                    toppingId: data._id,
                }).lean();
            })
        );

        return toppings.filter((topping) => topping !== null);
    }

    async create(orderPayload: IOrder) {
        return await OrderModel.create(orderPayload);
    }
}
