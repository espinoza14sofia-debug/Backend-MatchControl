// Importa el decorador Module de NestJS
import { Module } from '@nestjs/common';
// Importa el módulo de TypeORM para trabajar con la base de datos
import { TypeOrmModule } from '@nestjs/typeorm';
// Importa la entidad Organizacion
import { Organizacion } from './entities/organizacion.entity';  
// Importa el servicio de organización
import { OrganizacionService } from './organizacion.service';
// Importa el controlador de organización
import { OrganizacionController } from './organizacion.controller';

// Define el módulo de Organización
@Module({
  // Registra la entidad Organizacion en TypeORM
  imports: [TypeOrmModule.forFeature([Organizacion])],
  // Controlador que maneja las rutas de organización
  controllers: [OrganizacionController],
  // Servicio que contiene la lógica de negocio
  providers: [OrganizacionService],
  // Exporta el servicio para que otros módulos lo usen
  exports: [OrganizacionService],
})
export class OrganizacionModule {} // clase que representa el módulo