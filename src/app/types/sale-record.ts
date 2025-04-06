export interface SaleRecord {
    _id?: string;
    parameterType: 'inventory' | 'product' | 'customer';
    parameterId: string;
    entityId: string[]; 
    totalSalesAmount: string;
    createdAt?: Date;
    updatedAt?: Date;
}
