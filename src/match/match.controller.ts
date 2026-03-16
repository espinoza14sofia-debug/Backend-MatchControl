import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { RolesGuard } from '../auth/roles.guard';

// Controlador que maneja todas las rutas relacionadas con los partidos
@Controller('matches')
@UseGuards(RolesGuard)
export class MatchController {

    constructor(private readonly matchService: MatchService) { }

    // Crear un nuevo partido
    @Post()
    crear(@Body() dto: any) {
        return this.matchService.crear(dto);
    }

    // Obtener todos los partidos
    @Get()
    verTodos() {
        return this.matchService.findAll();
    }

    // Obtener partidos por fase
    @Get('fase/:id')
    verPorFase(@Param('id') id: string) {
        return this.matchService.findByFase(+id);
    }

    // Obtener un partido específico por id
    @Get(':id')
    verUno(@Param('id') id: string) {
        return this.matchService.findOne(+id);
    }

    // Actualizar información de un partido
    @Patch(':id')
    actualizar(@Param('id') id: string, @Body() dto: any) {
        return this.matchService.actualizar(+id, dto);
    }

    // Eliminar un partido
    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.matchService.eliminar(+id);
    }
}