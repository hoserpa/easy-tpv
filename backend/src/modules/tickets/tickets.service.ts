import { Injectable } from '@nestjs/common';
import { Ticket } from '../../common/entities/ticket.entity';
import { TicketLine } from '../../common/entities/ticket-line.entity';
import { CreateTicketDto } from '../../common/dto/create-ticket.dto';
import { CreateTicketLineDto } from '../../common/dto/create-ticket-line.dto';

@Injectable()
export class TicketsService {
  private tickets: Ticket[] = [];
  private ticketLines: TicketLine[] = [];
  private nextTicketId = 1;
  private nextLineId = 1;

  private calcularTotalLinea(line: CreateTicketLineDto): number {
    const subtotal = line.qty * line.unit_price;

    if (
      !line.discount_type ||
      !line.discount_value ||
      line.discount_value <= 0
    ) {
      return subtotal;
    }

    if (line.discount_type === 'fixed') {
      return Math.max(0, subtotal - line.discount_value);
    }

    if (line.discount_type === 'percent') {
      return Math.max(0, subtotal - (subtotal * line.discount_value) / 100);
    }

    return subtotal;
  }

  private calcularTicketTotal(
    lines: CreateTicketLineDto[],
    discountType?: 'fixed' | 'percent' | null,
    discountValue?: number | null,
  ): number {
    const subtotal = lines.reduce(
      (total, line) => total + this.calcularTotalLinea(line),
      0,
    );

    if (!discountType || !discountValue || discountValue <= 0) {
      return subtotal;
    }

    if (discountType === 'fixed') {
      return Math.max(0, subtotal - discountValue);
    }

    if (discountType === 'percent') {
      return Math.max(0, subtotal - (subtotal * discountValue) / 100);
    }

    return subtotal;
  }

  findAll(): Ticket[] {
    return this.tickets;
  }

  findOne(id: number): Ticket | null {
    return this.tickets.find((ticket) => ticket.id === id) || null;
  }

  findTicketLines(ticketId: number): TicketLine[] {
    return this.ticketLines.filter((line) => line.ticket_id === ticketId);
  }

  create(createTicketDto: CreateTicketDto): {
    ticket: Ticket;
    lines: TicketLine[];
  } {
    if (!createTicketDto.lines || createTicketDto.lines.length === 0) {
      throw new Error('El ticket debe tener al menos una línea');
    }

    const subtotal = createTicketDto.lines.reduce(
      (total, line) => total + this.calcularTotalLinea(line),
      0,
    );
    const total = this.calcularTicketTotal(
      createTicketDto.lines,
      createTicketDto.discount_type,
      createTicketDto.discount_value,
    );

    const nuevoTicket: Ticket = {
      id: this.nextTicketId++,
      subtotal,
      discount_type: createTicketDto.discount_type || null,
      discount_value: createTicketDto.discount_value || null,
      total,
      created_at: new Date(),
      updated_at: new Date(),
      ticketLines: [],
    };

    this.tickets.push(nuevoTicket);

    const nuevasLineas: TicketLine[] = createTicketDto.lines.map((lineDto) => {
      const lineTotal = this.calcularTotalLinea(lineDto);
      const linea: TicketLine = {
        id: this.nextLineId++,
        ticket_id: nuevoTicket.id,
        item_id: lineDto.item_id,
        qty: lineDto.qty,
        unit_price: lineDto.unit_price,
        discount_type: lineDto.discount_type || null,
        discount_value: lineDto.discount_value || null,
        total: lineTotal,
        created_at: new Date(),
        updated_at: new Date(),
        ticket: nuevoTicket,
        articulo: {} as any,
      };
      this.ticketLines.push(linea);
      return linea;
    });

    return { ticket: nuevoTicket, lines: nuevasLineas };
  }
}
