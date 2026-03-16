import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchParticipanteService } from './match_participante.service';
import { MatchParticipanteController } from './match_participante.controller';
import { MatchParticipante } from './entities/match_participante.entity';

// Módulo que maneja todo lo relacionado con los participantes de los partidos
@Module({

  // Se registra la entidad para poder interactuar con la tabla en la base de datos
  imports: [TypeOrmModule.forFeature([MatchParticipante])],

  // Controlador que maneja las rutas HTTP
  controllers: [MatchParticipanteController],

  // Servicio donde se encuentra la lógica del negocio
  providers: [MatchParticipanteService],

  // Se exporta el servicio para que pueda ser usado en otros módulos
  exports: [MatchParticipanteService]
})
export class MatchParticipanteModule {}