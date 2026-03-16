// Importa los decoradores y funciones de NestJS
import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe, UseGuards } from '@nestjs/common';
// Importa el servicio de sanción
import { SancionService } from './sancion.service';
// Importa el guard que controla los roles
import { RolesGuard } from '../auth/roles.guard';  
// Importa el decorador Roles para asignar permisos
import { Roles } from '../auth/roles.decorator';  

// Define el controlador para la ruta "sanciones"
@Controller('sanciones')
@UseGuards(RolesGuard) // aplica el guard de roles a todo el controlador
export class SancionController {
    
    // Constructor que inyecta el servicio de sanción
    constructor(private readonly service: SancionService) { }

    // Endpoint GET para obtener todas las sanciones
    @Get()
    @Roles('Admin', 'Organizador', 'Arbitro') // solo estos roles pueden acceder
    async findAll() {
        return await this.service.obtenerTodas(); // llama al servicio para listar sanciones
    }

    // Endpoint GET para obtener sanciones de un torneo específico
    @Get('torneo/:id')
    @Roles('Admin', 'Organizador', 'Arbitro', 'Participante') // roles permitidos
    async findByTorneo(@Param('id', ParseIntPipe) id: number) {
        return await this.service.obtenerPorTorneo(id); // llama al servicio con el ID del torneo
    }

    // Endpoint POST para crear una nueva sanción
    @Post()
    @Roles('Admin', 'Organizador') // solo Admin y Organizador pueden crear
    async create(@Body() data: any) {
        return await this.service.crear(data); // llama al servicio para crear
    }

    // Endpoint PATCH para actualizar una sanción por ID
    @Patch(':id')
    @Roles('Admin', 'Organizador') // solo Admin y Organizador pueden actualizar
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return await this.service.actualizar(id, data); // llama al servicio para actualizar
    }

    // Endpoint DELETE para eliminar una sanción por ID
    @Delete(':id')
    @Roles('Admin') // solo Admin puede eliminar
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.service.eliminar(id); // llama al servicio para borrar
    }
}