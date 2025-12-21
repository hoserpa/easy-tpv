import { TicketsService } from './tickets.service';
import { CreateTicketDto } from '../../common/dto/create-ticket.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(createTicketDto: CreateTicketDto): {
        ticket: import("../../common/entities/ticket.entity").Ticket;
        lines: import("../../common/entities/ticket-line.entity").TicketLine[];
    };
    findAll(): import("../../common/entities/ticket.entity").Ticket[];
    findOne(id: string): {
        lines: import("../../common/entities/ticket-line.entity").TicketLine[];
        id: number;
        subtotal: number;
        discount_type: "fixed" | "percent" | null;
        discount_value: number | null;
        total: number;
        created_at: Date;
        updated_at: Date;
    };
    findTicketLines(id: string): import("../../common/entities/ticket-line.entity").TicketLine[];
}
