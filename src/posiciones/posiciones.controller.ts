// Importa los decoradores y funciones de NestJS
import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
// Importa el servicio de posiciones
import { PosicionesService } from './posiciones.service';

// Define el controlador para la ruta "posiciones"
@Controller('posiciones')
export class PosicionesController {

    // Constructor que inyecta el servicio de posiciones
    constructor(private readonly service: PosicionesService) { }

    // Endpoint GET para obtener todas las posiciones
    @Get()
    async findAll() {
        return await this.service.verTodas(); // llama al servicio para listar todas
    }

    // Endpoint GET para obtener posiciones de un torneo específico
    @Get('torneo/:id')
    async getPosiciones(@Param('id', ParseIntPipe) id: number) {
        return await this.service.obtenerPosicionesPorTorneo(id); // llama al servicio con el ID del torneo
    }

    // Endpoint POST para crear una nueva posición
    @Post()
    async create(@Body() data: any) {
        return await this.service.crear(data); // llama al servicio para crear
    }

    // Endpoint PATCH para actualizar una posición por ID
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return await this.service.actualizar(id, data); // llama al servicio para actualizar
    }

    // Endpoint DELETE para eliminar una posición por ID
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.service.eliminar(id); // llama al servicio para borrar
    }
}