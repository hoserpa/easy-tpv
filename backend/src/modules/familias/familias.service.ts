import { Injectable } from '@nestjs/common';
import { Familia } from '../../common/entities/familia.entity';
import { CreateFamiliaDto } from '../../common/dto/create-familia.dto';
import { UpdateFamiliaDto } from '../../common/dto/update-familia.dto';

@Injectable()
export class FamiliasService {
  private familias: Familia[] = [];
  private nextId = 1;

  findAll(): Familia[] {
    return this.familias;
  }

  findOne(id: number): Familia | null {
    return this.familias.find((familia) => familia.id === id) || null;
  }

  create(createFamiliaDto: CreateFamiliaDto): Familia {
    const nuevaFamilia: Familia = {
      id: this.nextId++,
      name: createFamiliaDto.name,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.familias.push(nuevaFamilia);
    return nuevaFamilia;
  }

  update(id: number, updateFamiliaDto: UpdateFamiliaDto): Familia | null {
    const indiceFamilia = this.familias.findIndex(
      (familia) => familia.id === id,
    );
    if (indiceFamilia === -1) {
      return null;
    }

    this.familias[indiceFamilia] = {
      ...this.familias[indiceFamilia],
      ...updateFamiliaDto,
      updated_at: new Date(),
    };
    return this.familias[indiceFamilia];
  }

  remove(id: number): boolean {
    const indiceFamilia = this.familias.findIndex(
      (familia) => familia.id === id,
    );
    if (indiceFamilia === -1) {
      return false;
    }
    this.familias.splice(indiceFamilia, 1);
    return true;
  }
}
