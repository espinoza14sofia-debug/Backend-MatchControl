import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { RolesGuard } from '../auth/roles.guard';

// Controlador que maneja las rutas relacionadas con los grupos
@Controller('grupos')

// Se usa el guard para validar el acceso según el usuario
@UseGuards(RolesGuard)
export class GrupoController {

  // Se inyecta el servicio de grupos
  constructor(private readonly grupoService: GrupoService) { }

  // Endpoint para crear un nuevo grupo
  @Post()
  crear(@Body() dto: any) {
    return this.grupoService.crear(dto);
  }

  // Endpoint para obtener todos los grupos
  @Get()
  findAll() {
    return this.grupoService.findAll();
  }

  // Endpoint para obtener un grupo por su id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupoService.findOne(+id);
  }

  // Endpoint para obtener los grupos que pertenecen a una fase específica
  @Get('fase/:id')
  findByFase(@Param('id') id: string) {
    return this.grupoService.findByFase(+id);
  }

  // Endpoint para actualizar los datos de un grupo
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: any) {
    return this.grupoService.actualizar(+id, dto);
  }

  // Endpoint para eliminar un grupo por su id
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.grupoService.eliminar(+id);
  }
}