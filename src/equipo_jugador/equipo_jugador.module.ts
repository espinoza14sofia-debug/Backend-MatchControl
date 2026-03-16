import { Module } from '@nestjs/common';
import { EquipoJugadorService } from './equipo_jugador.service';
import { EquipoJugadorController } from './equipo_jugador.controller';
import { EquipoService } from '../equipo/equipo.service';

// Módulo que agrupa todo lo relacionado con los jugadores dentro de los equipos
@Module({

  // Controlador que maneja las rutas de equipo-jugador
  controllers: [EquipoJugadorController],

  // Servicios que se usan en este módulo
  // EquipoJugadorService maneja la lógica de los jugadores en equipos
  // EquipoService se usa para operaciones relacionadas con equipos
  providers: [EquipoJugadorService, EquipoService],
})
export class EquipoJugadorModule { }