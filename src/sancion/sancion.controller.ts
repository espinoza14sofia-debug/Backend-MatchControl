import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SancionService } from './sancion.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';

@Controller('sanciones')
export class SancionController {

    constructor(private readonly service: SancionService) { }

    @Get()
    async findAll() {
        return await this.service.obtenerTodas();
    }

    @Get('torneo/:id')
    async findByTorneo(@Param('id', ParseIntPipe) id: number) {
        return await this.service.obtenerPorTorneo(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin', 'Organizador')
    async create(@Body() data: any) {
        return await this.service.crear(data);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return await this.service.actualizar(id, data);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.service.eliminar(id);
    }
}