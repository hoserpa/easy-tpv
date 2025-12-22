import { TicketsService } from './tickets.service';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    test(data: any): Promise<{
        message: string;
        data: any;
    }>;
    create(createTicketDto: any): Promise<{
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
