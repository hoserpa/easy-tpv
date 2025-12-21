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
import { CreateTicketDto } from '../../common/dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    if (!createTicketDto.lines || createTicketDto.lines.length === 0) {
      throw new HttpException(
        'El ticket debe tener al menos una línea',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const line of createTicketDto.lines) {
      if (!line.item_id || line.item_id <= 0) {
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
      if (line.discount_value !== null && line.discount_value !== undefined && line.discount_value < 0) {
        throw new HttpException(
          'Valor de descuento inválido en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      createTicketDto.discount_type &&
      !['fixed', 'percent'].includes(createTicketDto.discount_type)
    ) {
      throw new HttpException(
        'Tipo de descuento inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      createTicketDto.discount_value !== null &&
      createTicketDto.discount_value !== undefined &&
      createTicketDto.discount_value < 0
    ) {
      throw new HttpException(
        'Valor de descuento inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    const ticket = this.ticketsService.findOne(ticketId);
    if (!ticket) {
      throw new HttpException('Ticket no encontrado', HttpStatus.NOT_FOUND);
    }
    return {
      ...ticket,
      lines: this.ticketsService.findTicketLines(ticketId),
    };
  }

  @Get(':id/lines')
  findTicketLines(@Param('id') id: string) {
    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    const ticket = this.ticketsService.findOne(ticketId);
    if (!ticket) {
      throw new HttpException('Ticket no encontrado', HttpStatus.NOT_FOUND);
    }
    return this.ticketsService.findTicketLines(ticketId);
  }
}
