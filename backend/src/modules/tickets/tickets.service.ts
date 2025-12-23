import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../../common/entities/ticket.entity';
import { TicketLine } from '../../common/entities/ticket-line.entity';
import { CreateTicketDto } from '../../common/dto/create-ticket.dto';
import { CreateTicketLineDto } from '../../common/dto/create-ticket-line.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    @InjectRepository(TicketLine)
    private readonly ticketLinesRepository: Repository<TicketLine>,
  ) {}

  private calcularSubtotalSinDescuentos(lines: CreateTicketLineDto[]): number {
    return lines.reduce((total, line) => total + line.qty * line.unit_price, 0);
  }

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
    // Para el ticket, el total es simplemente la suma de los totales de las líneas
    // Las líneas ya tienen sus descuentos aplicados individualmente
    const totalConDescuentosDeLineas = lines.reduce(
      (total, line) => total + this.calcularTotalLinea(line),
      0,
    );

    // Si no hay descuento a nivel de ticket, devolver el total de líneas
    if (!discountType || !discountValue || discountValue <= 0) {
      return totalConDescuentosDeLineas;
    }

    // NOTA: Los descuentos del ticket ya están representados en los valores que envía el frontend
    // Por lo tanto, no aplicar descuentos adicionales aquí
    return totalConDescuentosDeLineas;
  }

  findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.find({ relations: ['ticketLines'] });
  }

  findOne(id: number): Promise<Ticket | null> {
    return this.ticketsRepository.findOne({
      where: { id },
      relations: ['ticketLines'],
    });
  }

  findTicketLines(ticketId: number): Promise<TicketLine[]> {
    return this.ticketLinesRepository.find({
      where: { ticket_id: ticketId },
      relations: ['ticket', 'articulo'],
    });
  }

  async create(createTicketDto: CreateTicketDto): Promise<{
    ticket: Ticket;
    lines: TicketLine[];
  }> {
    if (!createTicketDto.lines || createTicketDto.lines.length === 0) {
      throw new Error('El ticket debe tener al menos una línea');
    }

    const subtotal = this.calcularSubtotalSinDescuentos(createTicketDto.lines);
    // Usar el total enviado por el frontend, ya que incluye todos los cálculos correctos
    const total = createTicketDto.total || this.calcularTicketTotal(
      createTicketDto.lines,
      createTicketDto.discount_type,
      createTicketDto.discount_value,
    );



    const nuevoTicket = this.ticketsRepository.create({
      subtotal,
      discount_type: createTicketDto.discount_type || null,
      discount_value: createTicketDto.discount_value || null,
      total,
    });

    const ticketGuardado = await this.ticketsRepository.save(nuevoTicket);

    const nuevasLineas: TicketLine[] = [];
    for (const lineDto of createTicketDto.lines) {
      const lineTotal = this.calcularTotalLinea(lineDto);
      const nuevaLinea = this.ticketLinesRepository.create({
        ticket_id: ticketGuardado.id,
        articulo_id: lineDto.articulo_id,
        qty: lineDto.qty,
        unit_price: lineDto.unit_price,
        discount_type: lineDto.discount_type || null,
        discount_value: lineDto.discount_value || null,
        total: lineTotal,
      });
      const lineaGuardada = await this.ticketLinesRepository.save(nuevaLinea);
      nuevasLineas.push(lineaGuardada);
    }

    return { ticket: ticketGuardado, lines: nuevasLineas };
  }
}
