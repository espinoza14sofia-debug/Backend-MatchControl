import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { RolesGuard } from '../auth/roles.guard';

// Controlador que maneja las rutas relacionadas con las categorías
@Controller('categoria')

// Se usa el guard para validar acceso según el usuario
@UseGuards(RolesGuard)
export class CategoriaController {

  // Se inyecta el servicio de categoría
  constructor(private readonly categoriaService: CategoriaService) { }

  // Endpoint para crear una nueva categoría
  @Post()
  crear(@Body() dto: any) {
    return this.categoriaService.crear(dto);
  }

  // Endpoint para obtener todas las categorías
  @Get()
  findAll() {
    return this.categoriaService.findAll();
  }

  // Endpoint para obtener una categoría por su id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(+id);
  }

  // Endpoint para eliminar una categoría por su id
  @Delete(':id')
  eliminar(@Param('id') id: string) {

    return this.categoriaService.eliminar(+id);
  }
}