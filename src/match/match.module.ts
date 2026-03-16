import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';

// Módulo que agrupa todo lo relacionado con los partidos (Match)
@Module({

  // Se importa la entidad Match para poder trabajar con la tabla en la base de datos
  imports: [TypeOrmModule.forFeature([Match])],

  // Controlador que maneja las rutas de los partidos
  controllers: [MatchController],

  // Servicio donde está la lógica de los partidos
  providers: [MatchService],

  // Se exporta el servicio para que otros módulos puedan usarlo
  exports: [MatchService],
})
export class MatchModule {}