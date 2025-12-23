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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const tickets_service_1 = require("./tickets.service");
let TicketsController = class TicketsController {
    ticketsService;
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    async test(data) {
        return { message: 'Test received', data };
    }
    async create(createTicketDto) {
        if (!createTicketDto.lines || createTicketDto.lines.length === 0) {
            throw new common_1.HttpException('El ticket debe tener al menos una línea', common_1.HttpStatus.BAD_REQUEST);
        }
        for (const line of createTicketDto.lines) {
            if (!line.articulo_id || line.articulo_id <= 0) {
                throw new common_1.HttpException('ID de artículo inválido en línea', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!line.qty || line.qty <= 0) {
                throw new common_1.HttpException('Cantidad inválida en línea', common_1.HttpStatus.BAD_REQUEST);
            }
            if (line.unit_price < 0) {
                throw new common_1.HttpException('Precio unitario inválido en línea', common_1.HttpStatus.BAD_REQUEST);
            }
            if (line.discount_type &&
                !['fixed', 'percent'].includes(line.discount_type)) {
                throw new common_1.HttpException('Tipo de descuento inválido en línea', common_1.HttpStatus.BAD_REQUEST);
            }
            if (line.discount_value !== null &&
                line.discount_value !== undefined &&
                line.discount_value < 0) {
                throw new common_1.HttpException('Valor de descuento inválido en línea', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        try {
            const result = await this.ticketsService.create(createTicketDto);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async findAll() {
        return this.ticketsService.findAll();
    }
    async findOne(id) {
        const ticketId = parseInt(id, 10);
        if (isNaN(ticketId)) {
            throw new common_1.HttpException('ID inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        const ticket = await this.ticketsService.findOne(ticketId);
        if (!ticket) {
            throw new common_1.HttpException('Ticket no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const lines = await this.ticketsService.findTicketLines(ticketId);
        return {
            ticket,
            lines,
        };
    }
    async findTicketLines(id) {
        const ticketId = parseInt(id, 10);
        if (isNaN(ticketId)) {
            throw new common_1.HttpException('ID inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        const ticket = await this.ticketsService.findOne(ticketId);
        if (!ticket) {
            throw new common_1.HttpException('Ticket no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return this.ticketsService.findTicketLines(ticketId);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "test", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/lines'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findTicketLines", null);
exports.TicketsController = TicketsController = __decorate([
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map