// Importa el decorador Module de NestJS
import { Module } from '@nestjs/common';
// Importa el módulo de TypeORM para trabajar con la base de datos
import { TypeOrmModule } from '@nestjs/typeorm';
// Importa la entidad Rol
import { Rol } from './entities/rol.entity'; 
// Importa el servicio de rol
import { RolService } from './rol.service';
// Importa el controlador de rol
import { RolController } from './rol.controller';

// Define el módulo de Rol
@Module({
  // Registra la entidad Rol en TypeORM
  imports: [TypeOrmModule.forFeature([Rol])],
  // Controlador que maneja las rutas de rol
  controllers: [RolController],
  // Servicio que contiene la lógica de negocio
  providers: [RolService],
  // Exporta el servicio para que otros módulos lo puedan usar
  exports: [RolService],
})
export class RolModule {} // clase que representa el módulo de rol