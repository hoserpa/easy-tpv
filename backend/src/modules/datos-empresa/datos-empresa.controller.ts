import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DatosEmpresaService } from './datos-empresa.service';
import { CreateDatosEmpresaDto } from '../../common/dto/create-datos-empresa.dto';
import { UpdateDatosEmpresaDto } from '../../common/dto/update-datos-empresa.dto';
import { DatosEmpresa } from '../../common/entities/datos-empresa.entity';

@Controller('datos-empresa')
export class DatosEmpresaController {
  constructor(private readonly datosEmpresaService: DatosEmpresaService) {}

  @Post()
  async create(
    @Body() createDatosEmpresaDto: CreateDatosEmpresaDto,
  ): Promise<DatosEmpresa> {
    try {
      return await this.datosEmpresaService.create(createDatosEmpresaDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El NIF ya está registrado');
      }
      throw new HttpException(
        'Error al crear los datos de la empresa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<DatosEmpresa[]> {
    return await this.datosEmpresaService.findAll();
  }

  @Get('first')
  async findFirst(): Promise<DatosEmpresa> {
    const datosEmpresa = await this.datosEmpresaService.findFirst();
    if (!datosEmpresa) {
      throw new NotFoundException('No hay datos de la empresa registrados');
    }
    return datosEmpresa;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DatosEmpresa> {
    const datosEmpresa = await this.datosEmpresaService.findOne(+id);
    if (!datosEmpresa) {
      throw new NotFoundException('Datos de la empresa no encontrados');
    }
    return datosEmpresa;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDatosEmpresaDto: UpdateDatosEmpresaDto,
  ): Promise<DatosEmpresa> {
    try {
      const datosEmpresa = await this.datosEmpresaService.findOne(+id);
      if (!datosEmpresa) {
        throw new NotFoundException('Datos de la empresa no encontrados');
      }
      return await this.datosEmpresaService.update(+id, updateDatosEmpresaDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El NIF ya está registrado');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Error al actualizar los datos de la empresa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('update-or-create')
  async updateOrCreate(
    @Body() updateDatosEmpresaDto: UpdateDatosEmpresaDto,
  ): Promise<DatosEmpresa> {
    try {
      return await this.datosEmpresaService.updateOrCreate(
        updateDatosEmpresaDto,
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El NIF ya está registrado');
      }
      throw new HttpException(
        'Error al guardar los datos de la empresa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const datosEmpresa = await this.datosEmpresaService.findOne(+id);
      if (!datosEmpresa) {
        throw new NotFoundException('Datos de la empresa no encontrados');
      }
      await this.datosEmpresaService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Error al eliminar los datos de la empresa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
