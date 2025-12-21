import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FamiliasModule } from './modules/familias/familias.module';
import { ArticulosModule } from './modules/articulos/articulos.module';
import { TicketsModule } from './modules/tickets/tickets.module';

@Module({
  imports: [FamiliasModule, ArticulosModule, TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
