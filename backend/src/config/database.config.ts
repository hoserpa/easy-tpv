import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Familia } from '../common/entities/familia.entity';
import { Articulo } from '../common/entities/articulo.entity';
import { Ticket } from '../common/entities/ticket.entity';
import { TicketLine } from '../common/entities/ticket-line.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Familia, Articulo, Ticket, TicketLine],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: true,
};
