import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from '../../common/entities/articulo.entity';
import { Familia } from '../../common/entities/familia.entity';
import { ArticulosController } from './articulos.controller';
import { ArticulosService } from './articulos.service';
import { FamiliasModule } from '../familias/familias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Articulo, Familia]),
    forwardRef(() => FamiliasModule),
  ],
  controllers: [ArticulosController],
  providers: [ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}
