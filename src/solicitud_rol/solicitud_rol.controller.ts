import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { SolicitudService } from './solicitud_rol.service';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('solicitudes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SolicitudController {

    constructor(private readonly service: SolicitudService) {}

    @Post('pedir')
    @Roles('Participante')
    async crear(@Body() dto: any) {
        return this.service.crear(dto);
    }

    @Get('pendientes')
    @Roles('Admin')
    async listarPendientes() {
        return this.service.obtenerPendientes();
    }

    @Patch('decidir/:idSolicitud')
    @Roles('Admin')
    async decidir(
        @Param('idSolicitud') id: number,
        @Body('estado') estado: 'Aprobado' | 'Rechazado',
        @Body('idOrganizacion') idOrganizacion?: number
    ) {
        return this.service.procesar(id, estado, idOrganizacion);
    }
}