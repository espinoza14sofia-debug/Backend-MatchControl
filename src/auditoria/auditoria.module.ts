import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditoria } from './entities/auditoria.entity';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaController } from './auditoria.controller';

// Este módulo agrupa todo lo relacionado con la auditoría
@Module({

  // Se importa TypeORM para poder usar la entidad Auditoria en la base de datos
  imports: [TypeOrmModule.forFeature([Auditoria])],

  // Controlador que maneja las rutas de auditoría
  controllers: [AuditoriaController],

  // Servicio donde está la lógica de la auditoría
  providers: [AuditoriaService],
})
export class AuditoriaModule { }