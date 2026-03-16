// Importa los decoradores y funciones de NestJS
import { Controller, Get, Post, Body, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
// Importa el servicio de organización
import { OrganizacionService } from './organizacion.service';
// Importa el guard que controla los roles
import { RolesGuard } from '../auth/roles.guard';

// Define el controlador para la ruta "organizacion"
@Controller('organizacion')
@UseGuards(RolesGuard) // aplica el guard de roles a todo el controlador
export class OrganizacionController {
  
  // Constructor que inyecta el servicio de organización
  constructor(private readonly organizacionService: OrganizacionService) { }

  // Endpoint POST para crear una organización
  @Post()
  @SetMetadata('roles', ['Admin']) // solo rol Admin puede usarlo
  create(@Body() dto: any) {
    return this.organizacionService.create(dto); // llama al servicio para crear
  }

  // Endpoint GET para obtener todas las organizaciones
  @Get()
  @SetMetadata('roles', ['Admin', 'Organizador']) // roles permitidos: Admin y Organizador
  findAll() {
    return this.organizacionService.findAll(); // llama al servicio para listar
  }

  // Endpoint DELETE para eliminar una organización por ID
  @Delete(':id')
  @SetMetadata('roles', ['Admin']) // solo rol Admin puede eliminar
  remove(@Param('id') id: string) {
    return this.organizacionService.remove(+id); // llama al servicio para borrar
  }
}