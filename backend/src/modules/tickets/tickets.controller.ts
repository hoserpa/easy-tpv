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

  @Post('test')
  async test(@Body() data: any) {
    console.log('Test endpoint received:', JSON.stringify(data, null, 2));
    return { message: 'Test received', data };
  }

  @Post()
  async create(@Body() createTicketDto: any) {
    console.log('Received ticket data:', JSON.stringify(createTicketDto, null, 2));

    if (!createTicketDto.lines || createTicketDto.lines.length === 0) {
      throw new HttpException(
        'El ticket debe tener al menos una línea',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const line of createTicketDto.lines) {
      if (!line.articulo_id || line.articulo_id <= 0) {
        console.error('Invalid articulo_id:', line.articulo_id);
        throw new HttpException(
          'ID de artículo inválido en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!line.qty || line.qty <= 0) {
        console.error('Invalid qty:', line.qty);
        throw new HttpException(
          'Cantidad inválida en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (line.unit_price < 0) {
        console.error('Invalid unit_price:', line.unit_price);
        throw new HttpException(
          'Precio unitario inválido en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        line.discount_type &&
        !['fixed', 'percent'].includes(line.discount_type)
      ) {
        console.error('Invalid discount_type:', line.discount_type);
        throw new HttpException(
          'Tipo de descuento inválido en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (line.discount_value !== null && line.discount_value !== undefined && line.discount_value < 0) {
        console.error('Invalid discount_value:', line.discount_value);
        throw new HttpException(
          'Valor de descuento inválido en línea',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      const result = await this.ticketsService.create(createTicketDto);
      console.log('Ticket created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating ticket:', error);
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
