import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SancionService } from './sancion.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';

@Controller('sanciones')
export class SancionController {

    constructor(private readonly service: SancionService) { }


    @Get()
    findAll() {
        return this.service.obtenerTodas();
    }


    @Get('torneo/:id')
    findByTorneo(@Param('id', ParseIntPipe) id: number) {
        return this.service.obtenerPorTorneo(id);
    }


    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.obtenerUna(id);
    }


    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin', 'Organizador')
    crear(@Body() data: any) {
        return this.service.crear(data);
    }


    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    actualizar(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.service.actualizar(id, data);
    }


    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.service.eliminar(id);
    }
}