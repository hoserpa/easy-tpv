"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_entity_1 = require("../../common/entities/ticket.entity");
const ticket_line_entity_1 = require("../../common/entities/ticket-line.entity");
let TicketsService = class TicketsService {
    ticketsRepository;
    ticketLinesRepository;
    constructor(ticketsRepository, ticketLinesRepository) {
        this.ticketsRepository = ticketsRepository;
        this.ticketLinesRepository = ticketLinesRepository;
    }
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
        return this.ticketsRepository.find({ relations: ['ticketLines'] });
    }
    findOne(id) {
        return this.ticketsRepository.findOne({
            where: { id },
            relations: ['ticketLines']
        });
    }
    findTicketLines(ticketId) {
        return this.ticketLinesRepository.find({
            where: { ticket_id: ticketId },
            relations: ['ticket', 'articulo']
        });
    }
    async create(createTicketDto) {
        if (!createTicketDto.lines || createTicketDto.lines.length === 0) {
            throw new Error('El ticket debe tener al menos una línea');
        }
        const subtotal = createTicketDto.lines.reduce((total, line) => total + this.calcularTotalLinea(line), 0);
        const total = this.calcularTicketTotal(createTicketDto.lines, createTicketDto.discount_type, createTicketDto.discount_value);
        const nuevoTicket = this.ticketsRepository.create({
            subtotal,
            discount_type: createTicketDto.discount_type || null,
            discount_value: createTicketDto.discount_value || null,
            total,
        });
        const ticketGuardado = await this.ticketsRepository.save(nuevoTicket);
        const nuevasLineas = [];
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
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(1, (0, typeorm_1.InjectRepository)(ticket_line_entity_1.TicketLine)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map