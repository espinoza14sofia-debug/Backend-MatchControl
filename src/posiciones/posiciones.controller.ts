import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PosicionesService } from './posiciones.service';

@Controller('posiciones')
export class PosicionesController {

    constructor(private readonly service: PosicionesService) { }


    @Get('torneo/:id')
    getPosiciones(@Param('id', ParseIntPipe) id: number) {
        return this.service.obtenerPosicionesPorTorneo(id);
    }


    @Get('consultar/:id')
    consultarPosiciones(@Param('id', ParseIntPipe) id: number) {
        return this.service.consultarPorTorneo(id);
    }


    @Post()
    crear(@Body() data: any) {
        return this.service.crear(data);
    }


    @Put(':id')
    actualizar(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.service.actualizar(id, data);
    }


    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.service.eliminar(id);
    }
}