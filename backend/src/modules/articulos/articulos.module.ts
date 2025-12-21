import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from '../../common/entities/articulo.entity';
import { Familia } from '../../common/entities/familia.entity';
import { ArticulosController } from './articulos.controller';
import { ArticulosService } from './articulos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo, Familia])],
  controllers: [ArticulosController],
  providers: [ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}
