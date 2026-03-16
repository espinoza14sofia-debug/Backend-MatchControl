import { Controller, Get, Post, Body, Patch, Param, UseGuards, SetMetadata } from '@nestjs/common';
import { ConfiguracionSistemaService } from './configuracion_sistema.service';
import { RolesGuard } from '../auth/roles.guard';

// Controlador que maneja las rutas de configuración del sistema
@Controller('configuracion_sistema')

// Se usa el guard para validar el acceso según el rol
@UseGuards(RolesGuard)
export class ConfiguracionSistemaController {

  // Se inyecta el servicio de configuración del sistema
  constructor(private readonly configService: ConfiguracionSistemaService) { }

  // Endpoint para obtener todas las configuraciones
  // Solo los usuarios con rol Admin pueden acceder
  @Get()
  @SetMetadata('roles', ['Admin'])
  findAll() {
    return this.configService.findAll();
  }

  // Endpoint para obtener una configuración por su id
  // Solo Admin puede acceder
  @Get(':id')
  @SetMetadata('roles', ['Admin'])
  findOne(@Param('id') id: string) {
    return this.configService.findOne(+id);
  }

  // Endpoint para crear una nueva configuración
  // Solo Admin puede hacerlo
  @Post()
  @SetMetadata('roles', ['Admin'])
  create(@Body() dto: any) {

    return this.configService.create(dto);
  }

  // Endpoint para actualizar una configuración existente
  // Solo Admin puede hacerlo
  @Patch(':id')
  @SetMetadata('roles', ['Admin'])
  update(@Param('id') id: string, @Body() dto: any) {
    return this.configService.update(+id, dto);
  }
}