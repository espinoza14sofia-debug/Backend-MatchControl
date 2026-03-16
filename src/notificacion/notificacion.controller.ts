import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';

@Controller('notificaciones')
export class NotificacionController {

    constructor(private readonly service: NotificacionService) { }

    @Get()
    async findAll() {
        return await this.service.obtenerTodas();
    }

    @Get('usuario/:id')
    async getByUser(@Param('id', ParseIntPipe) id: number) {
        return await this.service.obtenerPorUsuario(id);
    }

    @Post()
    async create(@Body() data: any) {
        return await this.service.crear(data);
    }

    @Patch('leer/:id')
    async markAsRead(@Param('id', ParseIntPipe) id: number) {
        return await this.service.marcarLeida(id);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.service.eliminar(id);
    }
}