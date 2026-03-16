import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosicionesService } from './posiciones.service';
import { PosicionesController } from './posiciones.controller';
import { Posiciones } from './entities/posiciones.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Posiciones])],
  controllers: [PosicionesController],
  providers: [PosicionesService],
  exports: [PosicionesService],
})
export class PosicionesModule { }