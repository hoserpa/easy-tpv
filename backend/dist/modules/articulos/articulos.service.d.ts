import { Articulo } from '../../common/entities/articulo.entity';
import { CreateArticuloDto } from '../../common/dto/create-articulo.dto';
import { UpdateArticuloDto } from '../../common/dto/update-articulo.dto';
export declare class ArticulosService {
    private articulos;
    private nextId;
    findAll(): Articulo[];
    findOne(id: number): Articulo | null;
    findByFamily(familyId: number): Articulo[];
    create(createArticuloDto: CreateArticuloDto): Articulo;
    update(id: number, updateArticuloDto: UpdateArticuloDto): Articulo | null;
    remove(id: number): boolean;
}
