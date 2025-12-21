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
} from '@nestjs/common';
import { FamiliasService } from './familias.service';
import { CreateFamiliaDto } from '../../common/dto/create-familia.dto';
import { UpdateFamiliaDto } from '../../common/dto/update-familia.dto';

@Controller('familias')
export class FamiliasController {
  constructor(private readonly familiasService: FamiliasService) {}

  @Post()
  create(@Body() createFamiliaDto: CreateFamiliaDto) {
    if (!createFamiliaDto.name || createFamiliaDto.name.trim().length === 0) {
      throw new HttpException(
        'El nombre de la familia es obligatorio',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.familiasService.create(createFamiliaDto);
  }

  @Get()
  findAll() {
    return this.familiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const familiaId = parseInt(id, 10);
    if (isNaN(familiaId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    const familia = this.familiasService.findOne(familiaId);
    if (!familia) {
      throw new HttpException('Familia no encontrada', HttpStatus.NOT_FOUND);
    }
    return familia;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFamiliaDto: UpdateFamiliaDto) {
    const familiaId = parseInt(id, 10);
    if (isNaN(familiaId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    if (updateFamiliaDto.name && updateFamiliaDto.name.trim().length === 0) {
      throw new HttpException(
        'El nombre de la familia no puede estar vacío',
        HttpStatus.BAD_REQUEST,
      );
    }
    const familia = this.familiasService.update(familiaId, updateFamiliaDto);
    if (!familia) {
      throw new HttpException('Familia no encontrada', HttpStatus.NOT_FOUND);
    }
    return familia;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const familiaId = parseInt(id, 10);
    if (isNaN(familiaId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    const eliminado = this.familiasService.remove(familiaId);
    if (!eliminado) {
      throw new HttpException('Familia no encontrada', HttpStatus.NOT_FOUND);
    }
    return { message: 'Familia eliminada correctamente' };
  }
}
