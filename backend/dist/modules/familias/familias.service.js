"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamiliasService = void 0;
const common_1 = require("@nestjs/common");
let FamiliasService = class FamiliasService {
    familias = [];
    nextId = 1;
    findAll() {
        return this.familias;
    }
    findOne(id) {
        return this.familias.find((familia) => familia.id === id) || null;
    }
    create(createFamiliaDto) {
        const nuevaFamilia = {
            id: this.nextId++,
            name: createFamiliaDto.name,
            created_at: new Date(),
            updated_at: new Date(),
        };
        this.familias.push(nuevaFamilia);
        return nuevaFamilia;
    }
    update(id, updateFamiliaDto) {
        const indiceFamilia = this.familias.findIndex((familia) => familia.id === id);
        if (indiceFamilia === -1) {
            return null;
        }
        this.familias[indiceFamilia] = {
            ...this.familias[indiceFamilia],
            ...updateFamiliaDto,
            updated_at: new Date(),
        };
        return this.familias[indiceFamilia];
    }
    remove(id) {
        const indiceFamilia = this.familias.findIndex((familia) => familia.id === id);
        if (indiceFamilia === -1) {
            return false;
        }
        this.familias.splice(indiceFamilia, 1);
        return true;
    }
};
exports.FamiliasService = FamiliasService;
exports.FamiliasService = FamiliasService = __decorate([
    (0, common_1.Injectable)()
], FamiliasService);
//# sourceMappingURL=familias.service.js.map