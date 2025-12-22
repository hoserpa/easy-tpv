import { Familia } from './familia.entity';
import { TicketLine } from './ticket-line.entity';
export declare class Articulo {
    id: number;
    familia_id: number;
    name: string;
    price: number;
    created_at: Date;
    updated_at: Date;
    familia: Familia;
    ticketLines: TicketLine[];
}
