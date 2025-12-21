export interface TicketLine {
    id: number;
    ticket_id: number;
    item_id: number;
    qty: number;
    unit_price: number;
    discount_type: 'fixed' | 'percent' | null;
    discount_value: number | null;
    total: number;
    created_at: Date;
    updated_at: Date;
}
