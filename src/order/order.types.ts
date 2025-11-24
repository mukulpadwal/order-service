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
