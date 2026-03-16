import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { DisciplinaService } from './disciplina.service';
import { RolesGuard } from '../auth/roles.guard';

// Controlador que maneja las rutas relacionadas con las disciplinas
@Controller('disciplina')

// Se usa el guard para validar acceso según el rol del usuario
@UseGuards(RolesGuard)
export class DisciplinaController {

    // Se inyecta el servicio de disciplina
    constructor(private readonly disciplinaService: DisciplinaService) { }

    // Endpoint para crear una nueva disciplina
    @Post()
    crear(@Body() dto: any) {
        return this.disciplinaService.crear(dto);
    }

    // Endpoint para obtener todas las disciplinas
    @Get()
    findAll() {
        return this.disciplinaService.findAll();
    }

    // Endpoint para eliminar una disciplina por su id
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.disciplinaService.remove(+id);
    }
}