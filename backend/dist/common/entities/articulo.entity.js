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
exports.Articulo = void 0;
const typeorm_1 = require("typeorm");
const familia_entity_1 = require("./familia.entity");
const ticket_line_entity_1 = require("./ticket-line.entity");
let Articulo = class Articulo {
    id;
    familia_id;
    name;
    price;
    created_at;
    updated_at;
    familia;
    ticketLines;
};
exports.Articulo = Articulo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Articulo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Articulo.prototype, "familia_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Articulo.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, unsigned: true, default: 0.00 }),
    __metadata("design:type", Number)
], Articulo.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Articulo.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Articulo.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => familia_entity_1.Familia, familia => familia.articulos),
    (0, typeorm_1.JoinColumn)({ name: 'familia_id' }),
    __metadata("design:type", familia_entity_1.Familia)
], Articulo.prototype, "familia", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_line_entity_1.TicketLine, ticketLine => ticketLine.articulo),
    __metadata("design:type", Array)
], Articulo.prototype, "ticketLines", void 0);
exports.Articulo = Articulo = __decorate([
    (0, typeorm_1.Entity)('articulos')
], Articulo);
//# sourceMappingURL=articulo.entity.js.map