import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaseService } from './fase.service';
import { FaseController } from './fase.controller';
import { Fase } from './entities/fase.entity';

// Módulo que agrupa todo lo relacionado con las fases de los torneos
@Module({

  // Se importa la entidad Fase para poder trabajar con la tabla en la base de datos
  imports: [TypeOrmModule.forFeature([Fase])],

  // Controlador que maneja las rutas de fases
  controllers: [FaseController],

  // Servicio donde está la lógica de las fases
  providers: [FaseService],

  // Se exporta el servicio para que otros módulos puedan usarlo
  exports: [FaseService]
})
export class FaseModule {}