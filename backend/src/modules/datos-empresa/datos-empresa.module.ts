import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatosEmpresaService } from './datos-empresa.service';
import { DatosEmpresaController } from './datos-empresa.controller';
import { DatosEmpresa } from '../../common/entities/datos-empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatosEmpresa])],
  controllers: [DatosEmpresaController],
  providers: [DatosEmpresaService],
  exports: [DatosEmpresaService],
})
export class DatosEmpresaModule {}
