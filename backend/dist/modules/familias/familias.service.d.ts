import { Familia } from '../../common/entities/familia.entity';
import { CreateFamiliaDto } from '../../common/dto/create-familia.dto';
import { UpdateFamiliaDto } from '../../common/dto/update-familia.dto';
export declare class FamiliasService {
    private familias;
    private nextId;
    findAll(): Familia[];
    findOne(id: number): Familia | null;
    create(createFamiliaDto: CreateFamiliaDto): Familia;
    update(id: number, updateFamiliaDto: UpdateFamiliaDto): Familia | null;
    remove(id: number): boolean;
}
