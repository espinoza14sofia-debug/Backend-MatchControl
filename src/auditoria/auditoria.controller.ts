import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// Controlador que maneja las rutas relacionadas con la auditoría
@Controller('auditoria')

// Se usa un guard para verificar los roles del usuario
@UseGuards(RolesGuard)

// Solo los usuarios con rol  de admin pueden acceder
@Roles('Admin')
export class AuditoriaController {

    // Se inyecta el servicio de auditoría
    constructor(private readonly service: AuditoriaService) { }

    // Endpoint para obtener todos los registros de auditoría
    @Get()
    async findAll() {
        return await this.service.obtenerTodo();
    }

    // Endpoint para obtener auditorías de un usuario específico
    // Se recibe el id del usuario por parámetro
    @Get('usuario/:id')
    async findByUser(@Param('id', ParseIntPipe) id: number) {
        return await this.service.obtenerPorUsuario(id);
    }
}