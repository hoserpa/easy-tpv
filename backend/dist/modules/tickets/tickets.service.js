"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
let TicketsService = class TicketsService {
    tickets = [];
    ticketLines = [];
    nextTicketId = 1;
    nextLineId = 1;
    calcularTotalLinea(line) {
        const subtotal = line.qty * line.unit_price;
        if (!line.discount_type ||
            !line.discount_value ||
            line.discount_value <= 0) {
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
    calcularTicketTotal(lines, discountType, discountValue) {
        const subtotal = lines.reduce((total, line) => total + this.calcularTotalLinea(line), 0);
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
    findAll() {
        return this.tickets;
    }
    findOne(id) {
        return this.tickets.find((ticket) => ticket.id === id) || null;
    }
    findTicketLines(ticketId) {
        return this.ticketLines.filter((line) => line.ticket_id === ticketId);
    }
    create(createTicketDto) {
        if (!createTicketDto.lines || createTicketDto.lines.length === 0) {
            throw new Error('El ticket debe tener al menos una línea');
        }
        const subtotal = createTicketDto.lines.reduce((total, line) => total + this.calcularTotalLinea(line), 0);
        const total = this.calcularTicketTotal(createTicketDto.lines, createTicketDto.discount_type, createTicketDto.discount_value);
        const nuevoTicket = {
            id: this.nextTicketId++,
            subtotal,
            discount_type: createTicketDto.discount_type || null,
            discount_value: createTicketDto.discount_value || null,
            total,
            created_at: new Date(),
            updated_at: new Date(),
        };
        this.tickets.push(nuevoTicket);
        const nuevasLineas = createTicketDto.lines.map((lineDto) => {
            const lineTotal = this.calcularTotalLinea(lineDto);
            const linea = {
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
            };
            this.ticketLines.push(linea);
            return linea;
        });
        return { ticket: nuevoTicket, lines: nuevasLineas };
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)()
], TicketsService);
//# sourceMappingURL=tickets.service.js.map