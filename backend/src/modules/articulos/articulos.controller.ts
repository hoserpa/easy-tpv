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
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from '../../common/dto/create-articulo.dto';
import { UpdateArticuloDto } from '../../common/dto/update-articulo.dto';
import { FamiliasService } from '../familias/familias.service';

@Controller('articulos')
export class ArticulosController {
  constructor(
    private readonly articulosService: ArticulosService,
    @Inject(forwardRef(() => FamiliasService))
    private readonly familiasService: FamiliasService,
  ) {}

  @Post()
  create(@Body() createArticuloDto: CreateArticuloDto) {
    if (!createArticuloDto.name || createArticuloDto.name.trim().length === 0) {
      throw new HttpException(
        'El nombre del artículo es obligatorio',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!createArticuloDto.family_id || createArticuloDto.family_id <= 0) {
      throw new HttpException(
        'El ID de la familia es inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (createArticuloDto.price < 0) {
      throw new HttpException(
        'El precio no puede ser negativo',
        HttpStatus.BAD_REQUEST,
      );
    }
    
    // Verificar que la familia exista
    const familia = this.familiasService.findOne(createArticuloDto.family_id);
    if (!familia) {
      throw new HttpException(
        'La familia especificada no existe',
        HttpStatus.NOT_FOUND,
      );
    }
    
    return this.articulosService.create(createArticuloDto);
  }

  @Get()
  findAll() {
    return this.articulosService.findAll();
  }

  @Get('family/:familyId')
  findByFamily(@Param('familyId') familyId: string) {
    const idFamilia = parseInt(familyId, 10);
    if (isNaN(idFamilia) || idFamilia <= 0) {
      throw new HttpException('ID de familia inválido', HttpStatus.BAD_REQUEST);
    }
    return this.articulosService.findByFamily(idFamilia);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const articuloId = parseInt(id, 10);
    if (isNaN(articuloId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    const articulo = this.articulosService.findOne(articuloId);
    if (!articulo) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }
    return articulo;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticuloDto: UpdateArticuloDto,
  ) {
    const articuloId = parseInt(id, 10);
    if (isNaN(articuloId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    if (updateArticuloDto.name && updateArticuloDto.name.trim().length === 0) {
      throw new HttpException(
        'El nombre del artículo no puede estar vacío',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      updateArticuloDto.family_id !== undefined &&
      updateArticuloDto.family_id <= 0
    ) {
      throw new HttpException(
        'El ID de la familia es inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
    
    // Verificar que la nueva familia exista (si se está actualizando)
    if (updateArticuloDto.family_id !== undefined) {
      const familia = this.familiasService.findOne(updateArticuloDto.family_id);
      if (!familia) {
        throw new HttpException(
          'La familia especificada no existe',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (updateArticuloDto.price !== undefined && updateArticuloDto.price < 0) {
      throw new HttpException(
        'El precio no puede ser negativo',
        HttpStatus.BAD_REQUEST,
      );
    }
    const articulo = this.articulosService.update(
      articuloId,
      updateArticuloDto,
    );
    if (!articulo) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }
    return articulo;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const articuloId = parseInt(id, 10);
    if (isNaN(articuloId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    const eliminado = this.articulosService.remove(articuloId);
    if (!eliminado) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }
    return { message: 'Artículo eliminado correctamente' };
  }
}
