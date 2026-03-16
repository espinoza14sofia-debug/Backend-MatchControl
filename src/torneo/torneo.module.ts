// Importa el decorador Module de NestJS
import { Module } from '@nestjs/common';
// Importa el módulo de TypeORM para trabajar con la base de datos
import { TypeOrmModule } from '@nestjs/typeorm';
// Importa el servicio de torneo
import { TorneoService } from './torneo.service';
// Importa el controlador de torneo
import { TorneoController } from './torneo.controller';
// Importa la entidad Torneo
import { Torneo } from './entities/torneo.entity';

// Define el módulo de Torneo
@Module({
  // Registra la entidad Torneo en TypeORM
  imports: [TypeOrmModule.forFeature([Torneo])],
  // Controlador que maneja las rutas de torneos
  controllers: [TorneoController],
  // Servicio que contiene la lógica de negocio
  providers: [TorneoService],  
  // Exporta el servicio para que otros módulos lo puedan usar
  exports: [TorneoService]
})
export class TorneoModule { } // clase que representa el módulo