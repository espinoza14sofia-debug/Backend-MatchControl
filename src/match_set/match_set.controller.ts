import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MatchSetService } from './match_set.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


@Controller('match-set')
@UseGuards(RolesGuard)
export class MatchSetController {

    constructor(private readonly msService: MatchSetService) { }

    @Post()
    @Roles('Admin', 'Arbitro')
    crear(@Body() dto: any) {
        return this.msService.crear(dto);
    }

    @Get('match/:id')
    @Roles('Admin', 'Organizador', 'Arbitro', 'Participante')
    verPorMatch(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.msService.verPorMatch(id);
    }

    @Patch(':idMatch/:numSet')
    @Roles('Admin', 'Arbitro')
    actualizar(
        @Param('idMatch', ParseIntPipe) idMatch: number,
        @Param('numSet', ParseIntPipe) numSet: number,
        @Body() dto: any
    ) {
        return this.msService.actualizar(idMatch, numSet, dto);
    }

    @Delete(':idMatch/:numSet')
    @Roles('Admin')
    eliminar(
        @Param('idMatch', ParseIntPipe) idMatch: number,
        @Param('numSet', ParseIntPipe) numSet: number
    ) {
        return this.msService.eliminar(idMatch, numSet);
    }
}