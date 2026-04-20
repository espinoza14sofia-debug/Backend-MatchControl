import { Controller, Post, Body, Get, Query, Put, Param, ParseIntPipe } from '@nestjs/common';
import { SolicitudService } from './solicitud_rol.service';

@Controller('solicitudes')
export class SolicitudController {
    constructor(private readonly solicitudService: SolicitudService) {}

    @Post()
    async crear(@Body() dto: any) {
        return await this.solicitudService.crear(dto);
    }

   
    @Get('pendientes')
    async obtenerPendientes() {
        return await this.solicitudService.obtenerPendientes();
    }

    
    @Get()
    async listar(@Query('id_usuario') idUsuario?: string) {
        if (idUsuario) {
            return await this.solicitudService.obtenerPorUsuario(Number(idUsuario));
        }
        return await this.solicitudService.obtenerPendientes();
    }

    @Put(':id/procesar')
    async procesar(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { estado: 'Aprobado' | 'Rechazado'; id_organizacion?: number }
    ) {
        return await this.solicitudService.procesar(id, body.estado, body.id_organizacion);
    }
}