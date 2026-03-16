import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { Categoria } from './entities/categoria.entity';

// Módulo que agrupa todo lo relacionado con las categorías
@Module({

  // Se importa la entidad Categoria para poder trabajar con la tabla en la base de datos
  imports: [TypeOrmModule.forFeature([Categoria])],

  // Controlador que maneja las rutas de categoría
  controllers: [CategoriaController],

  // Servicio donde está la lógica de las categorías
  providers: [CategoriaService],

  // Se exporta el servicio por si otro módulo necesita usarlo
  exports: [CategoriaService]
})
export class CategoriaModule { }