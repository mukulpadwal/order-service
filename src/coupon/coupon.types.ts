export interface ICoupon {
    title: string;
    code: string;
    discount: number;
    validUpto: Date;
    tenantId: number;
}

export interface ICouponFilter {
    discount?: number;
    validUpto?: Date;
    tenantId?: number;
}

