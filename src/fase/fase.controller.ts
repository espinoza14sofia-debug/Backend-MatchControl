import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { FaseService } from './fase.service';
import { RolesGuard } from '../auth/roles.guard';

// Controlador que maneja las rutas relacionadas con las fases de un torneo
@Controller('fases')

// Se usa el guard para validar el acceso según el usuario
@UseGuards(RolesGuard)
export class FaseController {

  // Se inyecta el servicio de fases
  constructor(private readonly faseService: FaseService) { }

  // Endpoint para crear una nueva fase
  @Post()
  crear(@Body() dto: any) {
    return this.faseService.crear(dto);
  }

  // Endpoint para obtener todas las fases
  @Get()
  findAll() {
    return this.faseService.findAll();
  }

  // Endpoint para obtener una fase por su id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faseService.findOne(+id);
  }

  // Endpoint para obtener las fases que pertenecen a un torneo específico
  @Get('torneo/:id')
  findByTorneo(@Param('id') id: string) {
    return this.faseService.findByTorneo(+id);
  }

  // Endpoint para actualizar los datos de una fase
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: any) {
    return this.faseService.actualizar(+id, dto);
  }

  // Endpoint para eliminar una fase por su id
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.faseService.eliminar(+id);
  }
}