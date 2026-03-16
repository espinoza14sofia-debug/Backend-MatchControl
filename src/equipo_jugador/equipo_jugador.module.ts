import { Module } from '@nestjs/common';
import { EquipoJugadorService } from './equipo_jugador.service';
import { EquipoJugadorController } from './equipo_jugador.controller';
import { EquipoService } from '../equipo/equipo.service';

@Module({
  controllers: [EquipoJugadorController],
  providers: [EquipoJugadorService, EquipoService],
})
export class EquipoJugadorModule { }