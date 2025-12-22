"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticulosService = void 0;
const common_1 = require("@nestjs/common");
let ArticulosService = class ArticulosService {
    articulos = [];
    nextId = 1;
    findAll() {
        return this.articulos;
    }
    findOne(id) {
        return this.articulos.find((articulo) => articulo.id === id) || null;
    }
    findByFamily(familyId) {
        return this.articulos.filter((articulo) => articulo.family_id === familyId);
    }
    create(createArticuloDto) {
        const nuevoArticulo = {
            id: this.nextId++,
            family_id: createArticuloDto.family_id,
            name: createArticuloDto.name,
            price: createArticuloDto.price,
            created_at: new Date(),
            updated_at: new Date(),
            familia: {},
            ticketLines: [],
        };
        this.articulos.push(nuevoArticulo);
        return nuevoArticulo;
    }
    update(id, updateArticuloDto) {
        const indiceArticulo = this.articulos.findIndex((articulo) => articulo.id === id);
        if (indiceArticulo === -1) {
            return null;
        }
        this.articulos[indiceArticulo] = {
            ...this.articulos[indiceArticulo],
            ...updateArticuloDto,
            updated_at: new Date(),
        };
        return this.articulos[indiceArticulo];
    }
    remove(id) {
        const indiceArticulo = this.articulos.findIndex((articulo) => articulo.id === id);
        if (indiceArticulo === -1) {
            return false;
        }
        this.articulos.splice(indiceArticulo, 1);
        return true;
    }
};
exports.ArticulosService = ArticulosService;
exports.ArticulosService = ArticulosService = __decorate([
    (0, common_1.Injectable)()
], ArticulosService);
//# sourceMappingURL=articulos.service.js.map