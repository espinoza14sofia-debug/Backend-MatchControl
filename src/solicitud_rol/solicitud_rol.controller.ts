import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { SolicitudService } from './solicitud_rol.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';

@Controller('solicitudes')
export class SolicitudController {

    constructor(private readonly service: SolicitudService) { }

    @Post('pedir')
    @UseGuards(AuthGuard('jwt'))
    async crear(@Body() dto: any) {
        return this.service.crear(dto);
    }

    @Get('pendientes')
    async listarPendientes() {
        return this.service.obtenerPendientes();
    }

    @Patch('decidir/:idSolicitud')
    async decidir(
        @Param('idSolicitud') id: number,
        @Body('estado') estado: 'Aprobado' | 'Rechazado',
        @Body('idOrganizacion') idOrganizacion?: number
    ) {
        return this.service.procesar(id, estado, idOrganizacion);
    }
}