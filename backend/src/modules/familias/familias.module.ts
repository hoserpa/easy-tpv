import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Familia } from '../../common/entities/familia.entity';
import { FamiliasController } from './familias.controller';
import { FamiliasService } from './familias.service';
import { ArticulosModule } from '../articulos/articulos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Familia]),
    forwardRef(() => ArticulosModule),
  ],
  controllers: [FamiliasController],
  providers: [FamiliasService],
  exports: [FamiliasService],
})
export class FamiliasModule {}
