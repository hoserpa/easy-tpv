import { Ticket } from '../../common/entities/ticket.entity';
import { TicketLine } from '../../common/entities/ticket-line.entity';
import { CreateTicketDto } from '../../common/dto/create-ticket.dto';
export declare class TicketsService {
    private tickets;
    private ticketLines;
    private nextTicketId;
    private nextLineId;
    private calcularTotalLinea;
    private calcularTicketTotal;
    findAll(): Ticket[];
    findOne(id: number): Ticket | null;
    findTicketLines(ticketId: number): TicketLine[];
    create(createTicketDto: CreateTicketDto): {
        ticket: Ticket;
        lines: TicketLine[];
    };
}
