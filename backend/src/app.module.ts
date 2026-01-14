import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FamiliasModule } from './modules/familias/familias.module';
import { ArticulosModule } from './modules/articulos/articulos.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { DatosEmpresaModule } from './modules/datos-empresa/datos-empresa.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    FamiliasModule,
    ArticulosModule,
    TicketsModule,
    DatosEmpresaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
