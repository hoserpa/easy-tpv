import { Repository } from 'typeorm';
import { Familia } from '../../common/entities/familia.entity';
import { CreateFamiliaDto } from '../../common/dto/create-familia.dto';
import { UpdateFamiliaDto } from '../../common/dto/update-familia.dto';
export declare class FamiliasService {
    private readonly familiasRepository;
    constructor(familiasRepository: Repository<Familia>);
    findAll(): Promise<Familia[]>;
    findOne(id: number): Promise<Familia | null>;
    create(createFamiliaDto: CreateFamiliaDto): Promise<Familia>;
    update(id: number, updateFamiliaDto: UpdateFamiliaDto): Promise<Familia | null>;
    remove(id: number): Promise<boolean>;
}
