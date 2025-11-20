export interface IPriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: Record<string, number>;
    };
}

export interface IProductCache {
    productId: string;
    priceConfiguration: IPriceConfiguration;
}

export interface IProductMessage {
    id: string;
    priceConfiguration: IPriceConfiguration;
}
