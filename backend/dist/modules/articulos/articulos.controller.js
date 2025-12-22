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
exports.ArticulosController = void 0;
const common_1 = require("@nestjs/common");
const articulos_service_1 = require("./articulos.service");
const create_articulo_dto_1 = require("../../common/dto/create-articulo.dto");
const update_articulo_dto_1 = require("../../common/dto/update-articulo.dto");
const familias_service_1 = require("../familias/familias.service");
let ArticulosController = class ArticulosController {
    articulosService;
    familiasService;
    constructor(articulosService, familiasService) {
        this.articulosService = articulosService;
        this.familiasService = familiasService;
    }
    async create(createArticuloDto) {
        if (!createArticuloDto.name || createArticuloDto.name.trim().length === 0) {
            throw new common_1.HttpException('El nombre del artículo es obligatorio', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!createArticuloDto.familia_id || createArticuloDto.familia_id <= 0) {
            throw new common_1.HttpException('El ID de la familia es inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        if (createArticuloDto.price < 0) {
            throw new common_1.HttpException('El precio no puede ser negativo', common_1.HttpStatus.BAD_REQUEST);
        }
        const familia = await this.familiasService.findOne(createArticuloDto.familia_id);
        if (!familia) {
            throw new common_1.HttpException('La familia especificada no existe', common_1.HttpStatus.NOT_FOUND);
        }
        return this.articulosService.create(createArticuloDto);
    }
    async findAll() {
        return this.articulosService.findAll();
    }
    async findByFamily(familyId) {
        const idFamilia = parseInt(familyId, 10);
        if (isNaN(idFamilia) || idFamilia <= 0) {
            throw new common_1.HttpException('ID de familia inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.articulosService.findByFamily(idFamilia);
    }
    async findOne(id) {
        const articuloId = parseInt(id, 10);
        if (isNaN(articuloId)) {
            throw new common_1.HttpException('ID inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        const articulo = await this.articulosService.findOne(articuloId);
        if (!articulo) {
            throw new common_1.HttpException('Artículo no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return articulo;
    }
    async update(id, updateArticuloDto) {
        const articuloId = parseInt(id, 10);
        if (isNaN(articuloId)) {
            throw new common_1.HttpException('ID inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        if (updateArticuloDto.name && updateArticuloDto.name.trim().length === 0) {
            throw new common_1.HttpException('El nombre del artículo no puede estar vacío', common_1.HttpStatus.BAD_REQUEST);
        }
        if (updateArticuloDto.familia_id !== undefined &&
            updateArticuloDto.familia_id <= 0) {
            throw new common_1.HttpException('El ID de la familia es inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        if (updateArticuloDto.familia_id !== undefined) {
            const familia = await this.familiasService.findOne(updateArticuloDto.familia_id);
            if (!familia) {
                throw new common_1.HttpException('La familia especificada no existe', common_1.HttpStatus.NOT_FOUND);
            }
        }
        if (updateArticuloDto.price !== undefined && updateArticuloDto.price < 0) {
            throw new common_1.HttpException('El precio no puede ser negativo', common_1.HttpStatus.BAD_REQUEST);
        }
        const articulo = await this.articulosService.update(articuloId, updateArticuloDto);
        if (!articulo) {
            throw new common_1.HttpException('Artículo no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return articulo;
    }
    async remove(id) {
        const articuloId = parseInt(id, 10);
        if (isNaN(articuloId)) {
            throw new common_1.HttpException('ID inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        const eliminado = await this.articulosService.remove(articuloId);
        if (!eliminado) {
            throw new common_1.HttpException('Artículo no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return { message: 'Artículo eliminado correctamente' };
    }
};
exports.ArticulosController = ArticulosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_articulo_dto_1.CreateArticuloDto]),
    __metadata("design:returntype", Promise)
], ArticulosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticulosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('family/:familyId'),
    __param(0, (0, common_1.Param)('familyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticulosController.prototype, "findByFamily", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticulosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_articulo_dto_1.UpdateArticuloDto]),
    __metadata("design:returntype", Promise)
], ArticulosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticulosController.prototype, "remove", null);
exports.ArticulosController = ArticulosController = __decorate([
    (0, common_1.Controller)('articulos'),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => familias_service_1.FamiliasService))),
    __metadata("design:paramtypes", [articulos_service_1.ArticulosService,
        familias_service_1.FamiliasService])
], ArticulosController);
//# sourceMappingURL=articulos.controller.js.map