import logger from "../config/logger.js";
import ProductCacheModel from "./productCache.model.js";
import type { IProductMessage } from "./productCache.types.js";

const handleProductUpdate = async (value: string | undefined) => {
    try {
        const product: IProductMessage = JSON.parse(value as string);

        return await ProductCacheModel.updateOne(
            {
                productId: product.id,
            },
            {
                $set: {
                    priceConfiguration: product.priceConfiguration,
                },
            },
            { upsert: true }
        );
    } catch (error) {
        logger.error("Something went wrong while parsing the product.");
    }
};

export default handleProductUpdate;
