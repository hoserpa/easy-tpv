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
exports.FamiliasController = void 0;
const common_1 = require("@nestjs/common");
const familias_service_1 = require("./familias.service");
const create_familia_dto_1 = require("../../common/dto/create-familia.dto");
const update_familia_dto_1 = require("../../common/dto/update-familia.dto");
const articulos_service_1 = require("../articulos/articulos.service");
let FamiliasController = class FamiliasController {
    familiasService;
    articulosService;
    constructor(familiasService, articulosService) {
        this.familiasService = familiasService;
        this.articulosService = articulosService;
    }
    async create(createFamiliaDto) {
        if (!createFamiliaDto.name || createFamiliaDto.name.trim().length === 0) {
            throw new common_1.HttpException('El nombre de la familia es obligatorio', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.familiasService.create(createFamiliaDto);
    }
    async findAll() {
        return this.familiasService.findAll();
    }
    async findOne(id) {
        const familiaId = parseInt(id, 10);
        if (isNaN(familiaId)) {
            throw new common_1.HttpException('ID inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        const familia = await this.familiasService.findOne(familiaId);
        if (!familia) {
            throw new common_1.HttpException('Familia no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        return familia;
    }
    async update(id, updateFamiliaDto) {
        const familiaId = parseInt(id, 10);
        if (isNaN(familiaId)) {
            throw new common_1.HttpException('ID inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        if (updateFamiliaDto.name && updateFamiliaDto.name.trim().length === 0) {
            throw new common_1.HttpException('El nombre de la familia no puede estar vacío', common_1.HttpStatus.BAD_REQUEST);
        }
        const familia = await this.familiasService.update(familiaId, updateFamiliaDto);
        if (!familia) {
            throw new common_1.HttpException('Familia no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        return familia;
    }
    async remove(id) {
        const familiaId = parseInt(id, 10);
        if (isNaN(familiaId)) {
            throw new common_1.HttpException('ID inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        const articulosAsociados = await this.articulosService.findByFamily(familiaId);
        if (articulosAsociados.length > 0) {
            throw new common_1.HttpException(`No se puede eliminar esta familia porque tiene ${articulosAsociados.length} artículo(s) asociado(s). Elimine primero los artículos o reasígnelos a otra familia.`, common_1.HttpStatus.CONFLICT);
        }
        const eliminado = await this.familiasService.remove(familiaId);
        if (!eliminado) {
            throw new common_1.HttpException('Familia no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        return { message: 'Familia eliminada correctamente' };
    }
};
exports.FamiliasController = FamiliasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_familia_dto_1.CreateFamiliaDto]),
    __metadata("design:returntype", Promise)
], FamiliasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamiliasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FamiliasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_familia_dto_1.UpdateFamiliaDto]),
    __metadata("design:returntype", Promise)
], FamiliasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FamiliasController.prototype, "remove", null);
exports.FamiliasController = FamiliasController = __decorate([
    (0, common_1.Controller)('familias'),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => articulos_service_1.ArticulosService))),
    __metadata("design:paramtypes", [familias_service_1.FamiliasService,
        articulos_service_1.ArticulosService])
], FamiliasController);
//# sourceMappingURL=familias.controller.js.map