export declare class CreateTicketLineDto {
    item_id: number;
    qty: number;
    unit_price: number;
    discount_type?: 'fixed' | 'percent' | null;
    discount_value?: number | null;
}
