import { TicketLine } from './ticket-line.entity';
export declare class Ticket {
    id: number;
    subtotal: number;
    discount_type: 'fixed' | 'percent' | null;
    discount_value: number | null;
    total: number;
    created_at: Date;
    updated_at: Date;
    ticketLines: TicketLine[];
}
