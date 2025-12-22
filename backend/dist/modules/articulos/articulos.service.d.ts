import { Repository } from 'typeorm';
import { Articulo } from '../../common/entities/articulo.entity';
import { CreateArticuloDto } from '../../common/dto/create-articulo.dto';
import { UpdateArticuloDto } from '../../common/dto/update-articulo.dto';
export declare class ArticulosService {
    private readonly articulosRepository;
    constructor(articulosRepository: Repository<Articulo>);
    findAll(): Promise<Articulo[]>;
    findOne(id: number): Promise<Articulo | null>;
    findByFamily(familyId: number): Promise<Articulo[]>;
    create(createArticuloDto: CreateArticuloDto): Promise<Articulo>;
    update(id: number, updateArticuloDto: UpdateArticuloDto): Promise<Articulo | null>;
    remove(id: number): Promise<boolean>;
}
