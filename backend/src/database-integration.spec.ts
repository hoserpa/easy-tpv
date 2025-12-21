import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliasModule } from './modules/familias/familias.module';
import { ArticulosModule } from './modules/articulos/articulos.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { FamiliasService } from './modules/familias/familias.service';
import { ArticulosService } from './modules/articulos/articulos.service';
import { TicketsService } from './modules/tickets/tickets.service';
import { databaseConfig } from './config/database.config';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

describe('DatabaseIntegrationService', () => {
  let familiasService: FamiliasService;
  let articulosService: ArticulosService;
  let ticketsService: TicketsService;
  let module: TestingModule;

  beforeAll(async () => {
    // Aumentar timeout a 30 segundos para conexión a base de datos
    jest.setTimeout(30000);
    
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...databaseConfig,
          synchronize: true,
          logging: false,
        }),
        FamiliasModule,
        ArticulosModule,
        TicketsModule,
      ],
    }).compile();

    familiasService = module.get<FamiliasService>(FamiliasService);
    articulosService = module.get<ArticulosService>(ArticulosService);
    ticketsService = module.get<TicketsService>(TicketsService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should create a familia', async () => {
    const familia = await familiasService.create({ name: 'Bebidas' });
    expect(familia).toBeDefined();
    expect(familia.id).toBeDefined();
    expect(familia.name).toBe('Bebidas');
  });

  it('should create an articulo', async () => {
    const familia = await familiasService.create({ name: 'Comidas' });
    const articulo = await articulosService.create({
      family_id: familia.id,
      name: 'Hamburguesa',
      price: 10.50,
    });
    expect(articulo).toBeDefined();
    expect(articulo.id).toBeDefined();
    expect(articulo.name).toBe('Hamburguesa');
    expect(articulo.price).toBe(10.50);
  });

  it('should create a ticket with lines', async () => {
    const familia = await familiasService.create({ name: 'Postres' });
    const articulo = await articulosService.create({
      family_id: familia.id,
      name: 'Tiramisú',
      price: 4.50,
    });

    const ticket = await ticketsService.create({
      lines: [
        {
          item_id: articulo.id,
          qty: 2,
          unit_price: 4.50,
        },
      ],
    });

    expect(ticket).toBeDefined();
    expect(ticket.ticket).toBeDefined();
    expect(ticket.ticket.id).toBeDefined();
    expect(ticket.ticket.total).toBe(9.00);
    expect(ticket.lines).toHaveLength(1);
  });
});