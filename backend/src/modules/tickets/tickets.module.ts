import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../../common/entities/ticket.entity';
import { TicketLine } from '../../common/entities/ticket-line.entity';
import { Articulo } from '../../common/entities/articulo.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketLine, Articulo])],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
