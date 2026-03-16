import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ParticipanteService } from './participante.service';
import { RolesGuard } from '../auth/roles.guard';


@Controller('participantes')
@UseGuards(RolesGuard)
export class ParticipanteController {

    constructor(private readonly participanteService: ParticipanteService) { }

    @Post()
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
    actualizar(@Param('id') id: string, @Body() dto: any) {
        return this.participanteService.actualizar(+id, dto);
    }


    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.participanteService.eliminar(+id);
    }
}