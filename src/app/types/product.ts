export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: DoubleRange;
    stock: Int16Array;
    fields: Record<string, string>;
}
