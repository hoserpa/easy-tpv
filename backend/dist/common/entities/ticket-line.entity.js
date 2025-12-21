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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketLine = void 0;
const typeorm_1 = require("typeorm");
const ticket_entity_1 = require("./ticket.entity");
const articulo_entity_1 = require("./articulo.entity");
let TicketLine = class TicketLine {
    id;
    ticket_id;
    item_id;
    qty;
    unit_price;
    discount_type;
    discount_value;
    total;
    created_at;
    updated_at;
    ticket;
    articulo;
};
exports.TicketLine = TicketLine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TicketLine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], TicketLine.prototype, "ticket_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], TicketLine.prototype, "item_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: 1 }),
    __metadata("design:type", Number)
], TicketLine.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, unsigned: true, default: 0.00 }),
    __metadata("design:type", Number)
], TicketLine.prototype, "unit_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['fixed', 'percent'], nullable: true }),
    __metadata("design:type", Object)
], TicketLine.prototype, "discount_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], TicketLine.prototype, "discount_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, unsigned: true, default: 0.00 }),
    __metadata("design:type", Number)
], TicketLine.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TicketLine.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TicketLine.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_entity_1.Ticket, ticket => ticket.ticketLines, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ticket_id' }),
    __metadata("design:type", ticket_entity_1.Ticket)
], TicketLine.prototype, "ticket", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo, articulo => articulo.ticketLines, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'item_id' }),
    __metadata("design:type", articulo_entity_1.Articulo)
], TicketLine.prototype, "articulo", void 0);
exports.TicketLine = TicketLine = __decorate([
    (0, typeorm_1.Entity)('ticket_lineas')
], TicketLine);
//# sourceMappingURL=ticket-line.entity.js.map