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
exports.ArticulosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const articulo_entity_1 = require("../../common/entities/articulo.entity");
let ArticulosService = class ArticulosService {
    articulosRepository;
    constructor(articulosRepository) {
        this.articulosRepository = articulosRepository;
    }
    findAll() {
        return this.articulosRepository.find({ relations: ['familia'] });
    }
    findOne(id) {
        return this.articulosRepository.findOne({
            where: { id },
            relations: ['familia']
        });
    }
    findByFamily(familyId) {
        return this.articulosRepository.find({
            where: { familia_id: familyId },
            relations: ['familia']
        });
    }
    create(createArticuloDto) {
        const nuevoArticulo = this.articulosRepository.create(createArticuloDto);
        return this.articulosRepository.save(nuevoArticulo);
    }
    async update(id, updateArticuloDto) {
        await this.articulosRepository.update(id, updateArticuloDto);
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.articulosRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
};
exports.ArticulosService = ArticulosService;
exports.ArticulosService = ArticulosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArticulosService);
//# sourceMappingURL=articulos.service.js.map