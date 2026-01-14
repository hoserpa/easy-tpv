import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosEmpresa } from '../../common/entities/datos-empresa.entity';
import { CreateDatosEmpresaDto } from '../../common/dto/create-datos-empresa.dto';
import { UpdateDatosEmpresaDto } from '../../common/dto/update-datos-empresa.dto';

@Injectable()
export class DatosEmpresaService {
  constructor(
    @InjectRepository(DatosEmpresa)
    private readonly datosEmpresaRepository: Repository<DatosEmpresa>,
  ) {}

  async create(
    createDatosEmpresaDto: CreateDatosEmpresaDto,
  ): Promise<DatosEmpresa> {
    const datosEmpresa = this.datosEmpresaRepository.create(
      createDatosEmpresaDto,
    );
    return await this.datosEmpresaRepository.save(datosEmpresa);
  }

  async findAll(): Promise<DatosEmpresa[]> {
    return await this.datosEmpresaRepository.find();
  }

  async findOne(id: number): Promise<DatosEmpresa | null> {
    return await this.datosEmpresaRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateDatosEmpresaDto: UpdateDatosEmpresaDto,
  ): Promise<DatosEmpresa> {
    await this.datosEmpresaRepository.update(id, updateDatosEmpresaDto);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Datos de la empresa no encontrados después de actualizar');
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.datosEmpresaRepository.delete(id);
  }

  async findFirst(): Promise<DatosEmpresa | null> {
    return await this.datosEmpresaRepository.findOne({
      order: { id: 'ASC' },
    });
  }

  async updateOrCreate(
    updateDatosEmpresaDto: UpdateDatosEmpresaDto,
  ): Promise<DatosEmpresa> {
    let datosEmpresa = await this.findFirst();

    if (datosEmpresa) {
      await this.datosEmpresaRepository.update(
        datosEmpresa.id,
        updateDatosEmpresaDto,
      );
      const updated = await this.findOne(datosEmpresa.id);
      if (!updated) {
        throw new Error('Datos de la empresa no encontrados después de actualizar');
      }
      datosEmpresa = updated;
    } else {
      datosEmpresa = await this.create(
        updateDatosEmpresaDto as CreateDatosEmpresaDto,
      );
    }

    return datosEmpresa;
  }
}
