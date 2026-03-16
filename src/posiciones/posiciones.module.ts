// Importa el decorador Module de NestJS
import { Module } from '@nestjs/common';
// Importa el módulo de TypeORM para trabajar con la base de datos
import { TypeOrmModule } from '@nestjs/typeorm';
// Importa el servicio de posiciones
import { PosicionesService } from './posiciones.service';
// Importa el controlador de posiciones
import { PosicionesController } from './posiciones.controller';
// Importa la entidad Posiciones
import { Posiciones } from './entities/posiciones.entity';

// Define el módulo de Posiciones
@Module({
  // Registra la entidad Posiciones en TypeORM
  imports: [TypeOrmModule.forFeature([Posiciones])],
  // Controlador que maneja las rutas de posiciones
  controllers: [PosicionesController],
  // Servicio que contiene la lógica de negocio
  providers: [PosicionesService],
  // Exporta el servicio para que otros módulos lo puedan usar
  exports: [PosicionesService],
})
export class PosicionesModule {} // clase que representa el módulo