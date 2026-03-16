import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { RolesGuard } from '../auth/roles.guard';

// Controlador que maneja las rutas relacionadas con los equipos
@Controller('equipos')

// Se usa el guard para validar el acceso según el usuario
@UseGuards(RolesGuard)
export class EquipoController {

    // Se inyecta el servicio de equipos
    constructor(private readonly equipoService: EquipoService) { }

    // Endpoint para crear un nuevo equipo
    @Post()
    crear(@Body() dto: any) {
        return this.equipoService.crear(dto);
    }

    // Endpoint para obtener todos los equipos
    @Get()
    findAll() {
        return this.equipoService.findAll();
    }

    // Endpoint para obtener un equipo por su id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.equipoService.findOne(+id);
    }

    // Endpoint para actualizar los datos de un equipo
    @Patch(':id')
    actualizar(@Param('id') id: string, @Body() dto: any) {
        return this.equipoService.actualizar(+id, dto);
    }

    // Endpoint para eliminar un equipo por su id
    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.equipoService.eliminar(+id);
    }
}