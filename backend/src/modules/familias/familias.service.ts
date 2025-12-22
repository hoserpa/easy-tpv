import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Familia } from '../../common/entities/familia.entity';
import { CreateFamiliaDto } from '../../common/dto/create-familia.dto';
import { UpdateFamiliaDto } from '../../common/dto/update-familia.dto';

@Injectable()
export class FamiliasService {
  constructor(
    @InjectRepository(Familia)
    private readonly familiasRepository: Repository<Familia>,
  ) {}

  findAll(): Promise<Familia[]> {
    return this.familiasRepository.find();
  }

  findOne(id: number): Promise<Familia | null> {
    return this.familiasRepository.findOne({ where: { id } });
  }

  create(createFamiliaDto: CreateFamiliaDto): Promise<Familia> {
    const nuevaFamilia = this.familiasRepository.create(createFamiliaDto);
    return this.familiasRepository.save(nuevaFamilia);
  }

  async update(
    id: number,
    updateFamiliaDto: UpdateFamiliaDto,
  ): Promise<Familia | null> {
    await this.familiasRepository.update(id, updateFamiliaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.familiasRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
