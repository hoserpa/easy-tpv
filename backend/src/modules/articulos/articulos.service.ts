import { Injectable } from '@nestjs/common';
import { Articulo } from '../../common/entities/articulo.entity';
import { CreateArticuloDto } from '../../common/dto/create-articulo.dto';
import { UpdateArticuloDto } from '../../common/dto/update-articulo.dto';

@Injectable()
export class ArticulosService {
  private articulos: Articulo[] = [];
  private nextId = 1;

  findAll(): Articulo[] {
    return this.articulos;
  }

  findOne(id: number): Articulo | null {
    return this.articulos.find((articulo) => articulo.id === id) || null;
  }

  findByFamily(familyId: number): Articulo[] {
    return this.articulos.filter((articulo) => articulo.family_id === familyId);
  }

  create(createArticuloDto: CreateArticuloDto): Articulo {
    const nuevoArticulo: Articulo = {
      id: this.nextId++,
      family_id: createArticuloDto.family_id,
      name: createArticuloDto.name,
      price: createArticuloDto.price,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.articulos.push(nuevoArticulo);
    return nuevoArticulo;
  }

  update(id: number, updateArticuloDto: UpdateArticuloDto): Articulo | null {
    const indiceArticulo = this.articulos.findIndex(
      (articulo) => articulo.id === id,
    );
    if (indiceArticulo === -1) {
      return null;
    }

    this.articulos[indiceArticulo] = {
      ...this.articulos[indiceArticulo],
      ...updateArticuloDto,
      updated_at: new Date(),
    };
    return this.articulos[indiceArticulo];
  }

  remove(id: number): boolean {
    const indiceArticulo = this.articulos.findIndex(
      (articulo) => articulo.id === id,
    );
    if (indiceArticulo === -1) {
      return false;
    }
    this.articulos.splice(indiceArticulo, 1);
    return true;
  }
}
