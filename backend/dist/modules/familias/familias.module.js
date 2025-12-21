"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamiliasModule = void 0;
const common_1 = require("@nestjs/common");
const familias_controller_1 = require("./familias.controller");
const familias_service_1 = require("./familias.service");
let FamiliasModule = class FamiliasModule {
};
exports.FamiliasModule = FamiliasModule;
exports.FamiliasModule = FamiliasModule = __decorate([
    (0, common_1.Module)({
        controllers: [familias_controller_1.FamiliasController],
        providers: [familias_service_1.FamiliasService],
    })
], FamiliasModule);
//# sourceMappingURL=familias.module.js.map