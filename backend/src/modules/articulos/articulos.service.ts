import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from '../../common/entities/articulo.entity';
import { CreateArticuloDto } from '../../common/dto/create-articulo.dto';
import { UpdateArticuloDto } from '../../common/dto/update-articulo.dto';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private readonly articulosRepository: Repository<Articulo>,
  ) {}

  findAll(): Promise<Articulo[]> {
    return this.articulosRepository.find({ relations: ['familia'] });
  }

  findOne(id: number): Promise<Articulo | null> {
    return this.articulosRepository.findOne({
      where: { id },
      relations: ['familia'],
    });
  }

  findByFamily(familyId: number): Promise<Articulo[]> {
    return this.articulosRepository.find({
      where: { familia_id: familyId },
      relations: ['familia'],
    });
  }

  create(createArticuloDto: CreateArticuloDto): Promise<Articulo> {
    const nuevoArticulo = this.articulosRepository.create(createArticuloDto);
    return this.articulosRepository.save(nuevoArticulo);
  }

  async update(
    id: number,
    updateArticuloDto: UpdateArticuloDto,
  ): Promise<Articulo | null> {
    await this.articulosRepository.update(id, updateArticuloDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.articulosRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
