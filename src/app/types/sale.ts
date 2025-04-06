export interface Sale {
    _id?: string;
    customer: string;
    products: PurchasedProduct[];
    totalAmount: string; 
    inventory: string;
    paymentIntentId: string;
    status: string;
}

export interface PurchasedProduct{
    product_id: string;
    price: string;  
    amount: string; 
}
