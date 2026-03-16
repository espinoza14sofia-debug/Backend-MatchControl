import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MatchParticipanteService } from './match_participante.service';
import { RolesGuard } from '../auth/roles.guard';

// Controlador que maneja las rutas de los participantes de un partido
@Controller('match-participantes')
@UseGuards(RolesGuard)
export class MatchParticipanteController {

    constructor(private readonly mpService: MatchParticipanteService) { }

    // Asignar un participante a un partido
    @Post()
    crear(@Body() dto: any) {
        return this.mpService.asignar(dto);
    }

    // Obtener los participantes de un partido específico
    @Get('match/:id')
    verPorMatch(@Param('id') id: string) {
        return this.mpService.findByMatch(+id);
    }

    // Actualizar información de un participante en un partido
    @Patch(':idMatch/:idPart')
    actualizar(
        @Param('idMatch') idMatch: string,
        @Param('idPart') idPart: string,
        @Body() dto: any
    ) {
        return this.mpService.actualizar(+idMatch, +idPart, dto);
    }

    // Eliminar un participante de un partido
    @Delete(':idMatch/:idPart')
    eliminar(
        @Param('idMatch') idMatch: string,
        @Param('idPart') idPart: string
    ) {
        return this.mpService.eliminar(+idMatch, +idPart);
    }
}