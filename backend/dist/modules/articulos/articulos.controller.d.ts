import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from '../../common/dto/create-articulo.dto';
import { UpdateArticuloDto } from '../../common/dto/update-articulo.dto';
import { FamiliasService } from '../familias/familias.service';
export declare class ArticulosController {
    private readonly articulosService;
    private readonly familiasService;
    constructor(articulosService: ArticulosService, familiasService: FamiliasService);
    create(createArticuloDto: CreateArticuloDto): import("../../common/entities/articulo.entity").Articulo;
    findAll(): import("../../common/entities/articulo.entity").Articulo[];
    findByFamily(familyId: string): import("../../common/entities/articulo.entity").Articulo[];
    findOne(id: string): import("../../common/entities/articulo.entity").Articulo;
    update(id: string, updateArticuloDto: UpdateArticuloDto): import("../../common/entities/articulo.entity").Articulo;
    remove(id: string): {
        message: string;
    };
}
