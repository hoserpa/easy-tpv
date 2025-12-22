import { FamiliasService } from './familias.service';
import { CreateFamiliaDto } from '../../common/dto/create-familia.dto';
import { UpdateFamiliaDto } from '../../common/dto/update-familia.dto';
import { ArticulosService } from '../articulos/articulos.service';
export declare class FamiliasController {
    private readonly familiasService;
    private readonly articulosService;
    constructor(familiasService: FamiliasService, articulosService: ArticulosService);
    create(createFamiliaDto: CreateFamiliaDto): import("../../common/entities/familia.entity").Familia;
    findAll(): import("../../common/entities/familia.entity").Familia[];
    findOne(id: string): import("../../common/entities/familia.entity").Familia;
    update(id: string, updateFamiliaDto: UpdateFamiliaDto): import("../../common/entities/familia.entity").Familia;
    remove(id: string): {
        message: string;
    };
}
