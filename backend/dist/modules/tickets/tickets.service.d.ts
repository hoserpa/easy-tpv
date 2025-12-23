import { Repository } from 'typeorm';
import { Ticket } from '../../common/entities/ticket.entity';
import { TicketLine } from '../../common/entities/ticket-line.entity';
import { CreateTicketDto } from '../../common/dto/create-ticket.dto';
export declare class TicketsService {
    private readonly ticketsRepository;
    private readonly ticketLinesRepository;
    constructor(ticketsRepository: Repository<Ticket>, ticketLinesRepository: Repository<TicketLine>);
    private calcularSubtotalSinDescuentos;
    private calcularTotalLinea;
    private calcularTicketTotal;
    findAll(): Promise<Ticket[]>;
    findOne(id: number): Promise<Ticket | null>;
    findTicketLines(ticketId: number): Promise<TicketLine[]>;
    create(createTicketDto: CreateTicketDto): Promise<{
        ticket: Ticket;
        lines: TicketLine[];
    }>;
}
