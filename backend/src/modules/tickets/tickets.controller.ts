import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('test')
  // eslint-disable-next-line @typescript-eslint/require-await
  async test(@Body() data: CreateTicketRequest) {
    return { message: 'Test received', data };
  }

  @Post()
  async create(@Body() createTicketDto: CreateTicketRequest) {
    if (!createTicketDto.lines || createTicketDto.lines.length === 0) {
      throw new HttpException(
        'El ticket debe tener al menos una línea',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const line of createTicketDto.lines) {
      if (!line.articulo_id || line.articulo_id <= 0) {
        throw new HttpException(
          'ID de artículo inválido en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!line.qty || line.qty <= 0) {
        throw new HttpException(
          'Cantidad inválida en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (line.unit_price < 0) {
        throw new HttpException(
          'Precio unitario inválido en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        line.discount_type &&
        !['fixed', 'percent'].includes(line.discount_type)
      ) {
        throw new HttpException(
          'Tipo de descuento inválido en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        line.discount_value !== null &&
        line.discount_value !== undefined &&
        line.discount_value < 0
      ) {
        throw new HttpException(
          'Valor de descuento inválido en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      const result = await this.ticketsService.create(createTicketDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    const ticket = await this.ticketsService.findOne(ticketId);
    if (!ticket) {
      throw new HttpException('Ticket no encontrado', HttpStatus.NOT_FOUND);
    }
    return {
      ...ticket,
      lines: await this.ticketsService.findTicketLines(ticketId),
    };
  }

  @Get(':id/lines')
  async findTicketLines(@Param('id') id: string) {
    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    const ticket = await this.ticketsService.findOne(ticketId);
    if (!ticket) {
      throw new HttpException('Ticket no encontrado', HttpStatus.NOT_FOUND);
    }
    return this.ticketsService.findTicketLines(ticketId);
  }
}
