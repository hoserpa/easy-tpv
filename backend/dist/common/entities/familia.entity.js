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
exports.Familia = void 0;
const typeorm_1 = require("typeorm");
const articulo_entity_1 = require("./articulo.entity");
let Familia = class Familia {
    id;
    name;
    created_at;
    updated_at;
    articulos;
};
exports.Familia = Familia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Familia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'name' }),
    __metadata("design:type", String)
], Familia.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Familia.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Familia.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => articulo_entity_1.Articulo, articulo => articulo.familia),
    __metadata("design:type", Array)
], Familia.prototype, "articulos", void 0);
exports.Familia = Familia = __decorate([
    (0, typeorm_1.Entity)('familias')
], Familia);
//# sourceMappingURL=familia.entity.js.map