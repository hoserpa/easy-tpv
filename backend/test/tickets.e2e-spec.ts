import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tickets API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const ticketDto = {
    lines: [
      {
        item_id: 1,
        qty: 2,
        unit_price: 10.0,
      },
      {
        item_id: 2,
        qty: 1,
        unit_price: 5.0,
      },
    ],
  };

  describe('/tickets (POST)', () => {
    it('should create a new ticket', () => {
      return request(app.getHttpServer())
        .post('/tickets')
        .send(ticketDto)
        .expect(201)
        .then((response) => {
          expect(response.body.ticket.id).toBeDefined();
          expect(response.body.ticket.subtotal).toBe(25.0);
          expect(response.body.ticket.total).toBe(25.0);
          expect(response.body.lines).toHaveLength(2);
          expect(response.body.lines[0].total).toBe(20.0);
          expect(response.body.lines[1].total).toBe(5.0);
        });
    });

    it('should create ticket with line discounts', () => {
      const ticketWithDiscounts = {
        lines: [
          {
            item_id: 1,
            qty: 2,
            unit_price: 10.0,
            discount_type: 'fixed',
            discount_value: 5.0,
          },
        ],
      };

      return request(app.getHttpServer())
        .post('/tickets')
        .send(ticketWithDiscounts)
        .expect(201)
        .then((response) => {
          expect(response.body.ticket.total).toBe(15.0);
          expect(response.body.lines[0].total).toBe(15.0);
        });
    });

    it('should create ticket with ticket discount', () => {
      const ticketWithTicketDiscount = {
        lines: [
          {
            item_id: 1,
            qty: 1,
            unit_price: 100.0,
          },
        ],
        discount_type: 'fixed',
        discount_value: 10.0,
      };

      return request(app.getHttpServer())
        .post('/tickets')
        .send(ticketWithTicketDiscount)
        .expect(201)
        .then((response) => {
          expect(response.body.ticket.subtotal).toBe(100.0);
          expect(response.body.ticket.total).toBe(90.0);
        });
    });

    it('should return 400 for empty lines', () => {
      return request(app.getHttpServer())
        .post('/tickets')
        .send({ lines: [] })
        .expect(400);
    });

    it('should return 400 for missing lines', () => {
      return request(app.getHttpServer()).post('/tickets').send({}).expect(400);
    });

    it('should return 400 for invalid item_id', () => {
      const invalidTicket = {
        lines: [
          {
            item_id: -1,
            qty: 1,
            unit_price: 10.0,
          },
        ],
      };

      return request(app.getHttpServer())
        .post('/tickets')
        .send(invalidTicket)
        .expect(400);
    });

    it('should return 400 for invalid qty', () => {
      const invalidTicket = {
        lines: [
          {
            item_id: 1,
            qty: 0,
            unit_price: 10.0,
          },
        ],
      };

      return request(app.getHttpServer())
        .post('/tickets')
        .send(invalidTicket)
        .expect(400);
    });

    it('should return 400 for negative price', () => {
      const invalidTicket = {
        lines: [
          {
            item_id: 1,
            qty: 1,
            unit_price: -10.0,
          },
        ],
      };

      return request(app.getHttpServer())
        .post('/tickets')
        .send(invalidTicket)
        .expect(400);
    });

    it('should return 400 for invalid discount type', () => {
      const invalidTicket = {
        lines: [
          {
            item_id: 1,
            qty: 1,
            unit_price: 10.0,
            discount_type: 'invalid',
          },
        ],
      };

      return request(app.getHttpServer())
        .post('/tickets')
        .send(invalidTicket)
        .expect(400);
    });
  });

  describe('/tickets (GET)', () => {
    it('should return an empty array initially', () => {
      return request(app.getHttpServer())
        .get('/tickets')
        .expect(200)
        .expect([]);
    });

    it('should return all tickets', async () => {
      await request(app.getHttpServer())
        .post('/tickets')
        .send({
          lines: [{ item_id: 1, qty: 1, unit_price: 10 }],
        });

      await request(app.getHttpServer())
        .post('/tickets')
        .send({
          lines: [{ item_id: 2, qty: 1, unit_price: 20 }],
        });

      return request(app.getHttpServer())
        .get('/tickets')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(2);
          expect(response.body[0].subtotal).toBe(10);
          expect(response.body[1].subtotal).toBe(20);
        });
    });
  });

  describe('/tickets/:id (GET)', () => {
    it('should return 404 for non-existent ticket', () => {
      return request(app.getHttpServer()).get('/tickets/999').expect(404);
    });

    it('should return ticket with lines', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/tickets')
        .send(ticketDto)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/tickets/${createResponse.body.ticket.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(createResponse.body.ticket.id);
          expect(response.body.lines).toHaveLength(2);
          expect(response.body.lines[0].item_id).toBe(1);
          expect(response.body.lines[1].item_id).toBe(2);
        });
    });
  });

  describe('/tickets/:id/lines (GET)', () => {
    it('should return 404 for non-existent ticket', () => {
      return request(app.getHttpServer()).get('/tickets/999/lines').expect(404);
    });

    it('should return ticket lines only', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/tickets')
        .send(ticketDto)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/tickets/${createResponse.body.ticket.id}/lines`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(2);
          expect(response.body[0].ticket_id).toBe(
            createResponse.body.ticket.id,
          );
          expect(response.body[1].ticket_id).toBe(
            createResponse.body.ticket.id,
          );
        });
    });
  });
});
