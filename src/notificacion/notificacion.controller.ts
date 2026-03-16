import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';

// Controlador que maneja las rutas relacionadas con las notificaciones
@Controller('notificaciones')
export class NotificacionController {

    constructor(private readonly service: NotificacionService) { }

    // Obtener todas las notificaciones
    @Get()
    async findAll() {
        return await this.service.obtenerTodas();
    }

    // Obtener las notificaciones de un usuario específico
    @Get('usuario/:id')
    async getByUser(@Param('id', ParseIntPipe) id: number) {
        return await this.service.obtenerPorUsuario(id);
    }

    // Crear una nueva notificación
    @Post()
    async create(@Body() data: any) {
        return await this.service.crear(data);
    }

    // Marcar una notificación como leída
    @Patch('leer/:id')
    async markAsRead(@Param('id', ParseIntPipe) id: number) {
        return await this.service.marcarLeida(id);
    }

    // Eliminar una notificación
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.service.eliminar(id);
    }
}