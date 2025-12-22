import { Ticket } from './ticket.entity';
import { Articulo } from './articulo.entity';
export declare class TicketLine {
    id: number;
    ticket_id: number;
    articulo_id: number;
    qty: number;
    unit_price: number;
    discount_type: 'fixed' | 'percent' | null;
    discount_value: number | null;
    total: number;
    created_at: Date;
    updated_at: Date;
    ticket: Ticket;
    articulo: Articulo;
}
