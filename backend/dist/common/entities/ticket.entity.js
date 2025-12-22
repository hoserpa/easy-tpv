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
exports.Ticket = void 0;
const typeorm_1 = require("typeorm");
const ticket_line_entity_1 = require("./ticket-line.entity");
let Ticket = class Ticket {
    id;
    subtotal;
    discount_type;
    discount_value;
    total;
    created_at;
    updated_at;
    ticketLines;
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, unsigned: true, default: 0.00, name: 'subtotal' }),
    __metadata("design:type", Number)
], Ticket.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['fixed', 'percent'], nullable: true, name: 'discount_type' }),
    __metadata("design:type", Object)
], Ticket.prototype, "discount_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, unsigned: true, nullable: true, name: 'discount_value' }),
    __metadata("design:type", Object)
], Ticket.prototype, "discount_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, unsigned: true, default: 0.00, name: 'total' }),
    __metadata("design:type", Number)
], Ticket.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Ticket.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Ticket.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_line_entity_1.TicketLine, ticketLine => ticketLine.ticket),
    __metadata("design:type", Array)
], Ticket.prototype, "ticketLines", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)('tickets')
], Ticket);
//# sourceMappingURL=ticket.entity.js.map