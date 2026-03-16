import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SancionService } from './sancion.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('sanciones')
@UseGuards(RolesGuard)
export class SancionController {


    constructor(private readonly service: SancionService) { }

    @Get()
    @Roles('Admin', 'Organizador', 'Arbitro')
    async findAll() {
        return await this.service.obtenerTodas();
    }


    @Get('torneo/:id')
    @Roles('Admin', 'Organizador', 'Arbitro', 'Participante')
    async findByTorneo(@Param('id', ParseIntPipe) id: number) {
        return await this.service.obtenerPorTorneo(id);
    }


    @Post()
    @Roles('Admin', 'Organizador')
    async create(@Body() data: any) {
        return await this.service.crear(data);
    }


    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return await this.service.actualizar(id, data);
    }


    @Delete(':id')
    @Roles('Admin')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.service.eliminar(id);
    }
}