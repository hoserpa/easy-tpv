import { TicketsService } from './tickets.service';
interface CreateTicketRequest {
    lines: Array<{
        articulo_id: number;
        qty: number;
        unit_price: number;
        discount_type?: 'fixed' | 'percent' | null;
        discount_value?: number | null;
    }>;
    discount_type?: 'fixed' | 'percent' | null;
    discount_value?: number | null;
}
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    test(data: CreateTicketRequest): Promise<{
        message: string;
        data: CreateTicketRequest;
    }>;
    create(createTicketDto: CreateTicketRequest): Promise<{
        ticket: import("../../common/entities/ticket.entity").Ticket;
        lines: import("../../common/entities/ticket-line.entity").TicketLine[];
    }>;
    findAll(): Promise<import("../../common/entities/ticket.entity").Ticket[]>;
    findOne(id: string): Promise<{
        lines: import("../../common/entities/ticket-line.entity").TicketLine[];
        id: number;
        subtotal: number;
        discount_type: "fixed" | "percent" | null;
        discount_value: number | null;
        total: number;
        created_at: Date;
        updated_at: Date;
        ticketLines: import("../../common/entities/ticket-line.entity").TicketLine[];
    }>;
    findTicketLines(id: string): Promise<import("../../common/entities/ticket-line.entity").TicketLine[]>;
}
export {};
