import logger from "../config/logger.js";
import ToppingCacheModel from "./toppingCache.model.js";
import type { IToppingMessage } from "./toppingCache.types.js";

const handleToppingUpdate = async (value: string | undefined) => {
    try {
        const topping: IToppingMessage = JSON.parse(value as string);

        return await ToppingCacheModel.updateOne(
            {
                toppingId: topping.id,
            },
            {
                $set: {
                    price: topping.price,
                },
            },
            { upsert: true }
        );
    } catch (error) {
        logger.error("Something went wrong while parsing the topping.");
    }
};

export default handleToppingUpdate;
