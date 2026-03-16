// Importa el decorador Module de NestJS
import { Module } from '@nestjs/common';
// Importa el módulo de TypeORM para trabajar con la base de datos
import { TypeOrmModule } from '@nestjs/typeorm';
// Importa la entidad Sancion
import { Sancion } from './entities/sancion.entity';
// Importa el servicio de sanción
import { SancionService } from './sancion.service';
// Importa el controlador de sanción
import { SancionController } from './sancion.controller';

// Define el módulo de Sanción
@Module({
  // Registra la entidad Sancion en TypeORM
  imports: [TypeOrmModule.forFeature([Sancion])],
  // Controlador que maneja las rutas de sanciones
  controllers: [SancionController],
  // Servicio que contiene la lógica de negocio
  providers: [SancionService],
})
export class SancionModule { } // clase que representa el módulo de sanción  