import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from '../../common/dto/create-ticket.dto';

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsService],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an empty array initially', () => {
      expect(service.findAll()).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new ticket with lines', () => {
      const createTicketDto: CreateTicketDto = {
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

      const result = service.create(createTicketDto);

      expect(result.ticket.id).toBe(1);
      expect(result.ticket.subtotal).toBe(25.0);
      expect(result.ticket.total).toBe(25.0);
      expect(result.ticket.discount_type).toBeNull();
      expect(result.ticket.discount_value).toBeNull();
      expect(result.lines).toHaveLength(2);
      expect(result.lines[0].total).toBe(20.0);
      expect(result.lines[1].total).toBe(5.0);
    });

    it('should calculate line discount correctly - fixed', () => {
      const createTicketDto: CreateTicketDto = {
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

      const result = service.create(createTicketDto);

      expect(result.lines[0].total).toBe(15.0);
      expect(result.ticket.total).toBe(15.0);
    });

    it('should calculate line discount correctly - percent', () => {
      const createTicketDto: CreateTicketDto = {
        lines: [
          {
            item_id: 1,
            qty: 2,
            unit_price: 10.0,
            discount_type: 'percent',
            discount_value: 10.0,
          },
        ],
      };

      const result = service.create(createTicketDto);

      expect(result.lines[0].total).toBe(18.0);
      expect(result.ticket.total).toBe(18.0);
    });

    it('should calculate ticket discount correctly - fixed', () => {
      const createTicketDto: CreateTicketDto = {
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

      const result = service.create(createTicketDto);

      expect(result.ticket.subtotal).toBe(100.0);
      expect(result.ticket.total).toBe(90.0);
    });

    it('should calculate ticket discount correctly - percent', () => {
      const createTicketDto: CreateTicketDto = {
        lines: [
          {
            item_id: 1,
            qty: 1,
            unit_price: 100.0,
          },
        ],
        discount_type: 'percent',
        discount_value: 10.0,
      };

      const result = service.create(createTicketDto);

      expect(result.ticket.subtotal).toBe(100.0);
      expect(result.ticket.total).toBe(90.0);
    });

    it('should throw error for empty lines', () => {
      const createTicketDto: CreateTicketDto = {
        lines: [],
      };

      expect(() => service.create(createTicketDto)).toThrow();
    });

    it('should prevent negative totals', () => {
      const createTicketDto: CreateTicketDto = {
        lines: [
          {
            item_id: 1,
            qty: 1,
            unit_price: 5.0,
            discount_type: 'fixed',
            discount_value: 10.0,
          },
        ],
      };

      const result = service.create(createTicketDto);

      expect(result.lines[0].total).toBe(0);
      expect(result.ticket.total).toBe(0);
    });
  });

  describe('findTicketLines', () => {
    it('should return empty array for non-existent ticket', () => {
      expect(service.findTicketLines(999)).toEqual([]);
    });

    it('should return lines for existing ticket', () => {
      const createTicketDto: CreateTicketDto = {
        lines: [
          {
            item_id: 1,
            qty: 2,
            unit_price: 10.0,
          },
        ],
      };

      const created = service.create(createTicketDto);
      const result = service.findTicketLines(created.ticket.id);

      expect(result).toHaveLength(1);
      expect(result[0].ticket_id).toBe(created.ticket.id);
    });
  });
});
