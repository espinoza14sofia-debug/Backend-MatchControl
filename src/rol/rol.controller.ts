// Importa los decoradores y funciones de NestJS
import { Controller, Get, Param, Patch, Body, UseGuards, SetMetadata } from '@nestjs/common';
// Importa el servicio de rol
import { RolService } from './rol.service';
// Importa el guard que controla los roles
import { RolesGuard } from '../auth/roles.guard';

// Define el controlador para la ruta "rol"
@Controller('rol')
@UseGuards(RolesGuard) // aplica el guard de roles a todo el controlador
export class RolController {
  
  // Constructor que inyecta el servicio de rol
  constructor(private readonly rolService: RolService) { }

  // Endpoint GET para obtener todos los roles
  @Get()
  @SetMetadata('roles', ['Admin']) // solo rol Admin puede acceder
  findAll() {
    return this.rolService.findAll(); // llama al servicio para listar roles
  }

  // Endpoint PATCH para actualizar un rol por ID
  @Patch(':id')
  @SetMetadata('roles', ['Admin']) // solo rol Admin puede actualizar
  update(@Param('id') id: string, @Body() dto: any) {
    return this.rolService.update(+id, dto); // llama al servicio para actualizar
  }
}