// Importa los decoradores y funciones de NestJS
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
// Importa el servicio de participante
import { ParticipanteService } from './participante.service';
// Importa el guard que controla los roles
import { RolesGuard } from '../auth/roles.guard';

// Define el controlador para la ruta "participantes"
@Controller('participantes')
@UseGuards(RolesGuard) // aplica el guard de roles a todo el controlador
export class ParticipanteController {

    // Constructor que inyecta el servicio de participante
    constructor(private readonly participanteService: ParticipanteService) { }

    // Endpoint POST para crear un participante
    @Post()
    crear(@Body() dto: any) {
        return this.participanteService.crear(dto); // llama al servicio para crear
    }

    // Endpoint GET para obtener todos los participantes
    @Get()
    findAll() {
        return this.participanteService.findAll(); // llama al servicio para listar
    }

    // Endpoint GET para obtener un participante por ID
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.participanteService.findOne(+id); // llama al servicio para buscar por ID
    }

    // Endpoint PATCH para actualizar un participante por ID
    @Patch(':id')
    actualizar(@Param('id') id: string, @Body() dto: any) {
        return this.participanteService.actualizar(+id, dto); // llama al servicio para actualizar
    }

    // Endpoint DELETE para eliminar un participante por ID
    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.participanteService.eliminar(+id); // llama al servicio para borrar
    }
}