import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MatchParticipanteService } from './match_participante.service';
import { RolesGuard } from '../auth/roles.guard';

@Controller('match-participantes')
@UseGuards(RolesGuard)
export class MatchParticipanteController {

    constructor(private readonly mpService: MatchParticipanteService) { }


    @Post()
    crear(@Body() dto: any) {
        return this.mpService.asignar(dto);
    }

    @Get('match/:id')
    verPorMatch(@Param('id') id: string) {
        return this.mpService.findByMatch(+id);
    }

    @Patch(':idMatch/:idPart')
    actualizar(
        @Param('idMatch') idMatch: string,
        @Param('idPart') idPart: string,
        @Body() dto: any
    ) {
        return this.mpService.actualizar(+idMatch, +idPart, dto);
    }

    @Delete(':idMatch/:idPart')
    eliminar(
        @Param('idMatch') idMatch: string,
        @Param('idPart') idPart: string
    ) {
        return this.mpService.eliminar(+idMatch, +idPart);
    }
}