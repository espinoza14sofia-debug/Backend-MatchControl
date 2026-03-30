import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ParticipanteService } from './participante.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('participantes')
export class ParticipanteController {

    constructor(private readonly participanteService: ParticipanteService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    crear(@Body() dto: any) {
        return this.participanteService.crear(dto);
    }

    @Get()
    findAll() {
        return this.participanteService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.participanteService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    actualizar(@Param('id') id: string, @Body() dto: any) {
        return this.participanteService.actualizar(+id, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    eliminar(@Param('id') id: string) {
        return this.participanteService.eliminar(+id);
    }
}