// Importa el decorador Module de NestJS
import { Module } from '@nestjs/common';
// Importa el servicio de participante
import { ParticipanteService } from './participante.service';
// Importa el controlador de participante
import { ParticipanteController } from './participante.controller';

// Define el módulo de Participante
@Module({
  // Controlador que maneja las rutas de participante
  controllers: [ParticipanteController],
  // Servicio que contiene la lógica de negocio
  providers: [ParticipanteService],
  // Exporta el servicio para que otros módulos lo puedan usar
  exports: [ParticipanteService],  
})
export class ParticipanteModule { } // clase que representa el módulo