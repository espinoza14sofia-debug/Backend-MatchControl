import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PosicionesService } from './posiciones.service';

@Controller('posiciones')
export class PosicionesController {


    constructor(private readonly service: PosicionesService) { }


    @Get()
    async findAll() {
        return await this.service.verTodas();
    }

    @Get('torneo/:id')
    async getPosiciones(@Param('id', ParseIntPipe) id: number) {
        return await this.service.obtenerPosicionesPorTorneo(id);
    }


    @Post()
    async create(@Body() data: any) {
        return await this.service.crear(data);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return await this.service.actualizar(id, data);
    }


    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.service.eliminar(id);
    }
}