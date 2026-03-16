import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplinaService } from './disciplina.service';
import { DisciplinaController } from './disciplina.controller';
import { Disciplina } from './entities/disciplina.entity';

// Módulo que agrupa todo lo relacionado con las disciplinas
@Module({

  // Se importa la entidad Disciplina para poder usar la tabla en la base de datos
  imports: [TypeOrmModule.forFeature([Disciplina])],

  // Controlador que maneja las rutas de disciplina
  controllers: [DisciplinaController],

  // Servicio donde está la lógica de las disciplinas
  providers: [DisciplinaService],

  // Se exporta el servicio para que otros módulos puedan usarlo si lo necesitan
  exports: [DisciplinaService]
})
export class DisciplinaModule {}