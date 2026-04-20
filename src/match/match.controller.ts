import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { RolesGuard } from '../auth/roles.guard';

@Controller('matches')
@UseGuards(RolesGuard)
export class MatchController {

    constructor(private readonly matchService: MatchService) { }


    @Post()
    crear(@Body() dto: any) {
        return this.matchService.crear(dto);
    }


    @Get()
    verTodos() {
        return this.matchService.findAll();
    }


    @Get('fase/:id')
    verPorFase(@Param('id') id: string) {
        return this.matchService.findByFase(+id);
    }


    @Get(':id')
    verUno(@Param('id') id: string) {
        return this.matchService.findOne(+id);
    }


    @Put(':id')
    actualizar(@Param('id') id: string, @Body() dto: any) {
        return this.matchService.actualizar(+id, dto);
    }


    @Post(':id/resultado')
    registrarResultado(@Param('id') id: string, @Body() dto: any) {
        return this.matchService.registrarResultado(+id, dto);
    }
    
    @Patch(':id/estado')
cambiarEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.matchService.actualizar(+id, { Estado: estado });
}

    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.matchService.eliminar(+id);
    }
}