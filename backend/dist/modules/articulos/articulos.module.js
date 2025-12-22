"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticulosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const articulo_entity_1 = require("../../common/entities/articulo.entity");
const familia_entity_1 = require("../../common/entities/familia.entity");
const articulos_controller_1 = require("./articulos.controller");
const articulos_service_1 = require("./articulos.service");
const familias_module_1 = require("../familias/familias.module");
let ArticulosModule = class ArticulosModule {
};
exports.ArticulosModule = ArticulosModule;
exports.ArticulosModule = ArticulosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([articulo_entity_1.Articulo, familia_entity_1.Familia]), (0, common_1.forwardRef)(() => familias_module_1.FamiliasModule)],
        controllers: [articulos_controller_1.ArticulosController],
        providers: [articulos_service_1.ArticulosService],
        exports: [articulos_service_1.ArticulosService],
    })
], ArticulosModule);
//# sourceMappingURL=articulos.module.js.map