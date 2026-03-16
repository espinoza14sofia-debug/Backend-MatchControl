import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { Grupo } from './entities/grupo.entity';

// Módulo que agrupa todo lo relacionado con los grupos
@Module({

  // Se importa la entidad Grupo para poder trabajar con la tabla en la base de datos
  imports: [TypeOrmModule.forFeature([Grupo])],

  // Controlador que maneja las rutas de grupos
  controllers: [GrupoController],

  // Servicio donde está la lógica de los grupos
  providers: [GrupoService],

  // Se exporta el servicio para que otros módulos puedan usarlo
  exports: [GrupoService]
})
export class GrupoModule {}