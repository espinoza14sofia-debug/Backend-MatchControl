import { Module } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';

// Módulo que agrupa todo lo relacionado con los equipos
@Module({

  // Controlador que maneja las rutas de equipos
  controllers: [EquipoController],

  // Servicio donde está la lógica de los equipos
  providers: [EquipoService],
})
export class EquipoModule { }