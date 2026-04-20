import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TorneoService } from './torneo.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('torneo')
export class TorneoController {

    constructor(private readonly torneoService: TorneoService) { }


    @Post()
    @UseGuards(RolesGuard)
    crear(@Body() dto: any) {
        return this.torneoService.crear(dto);
    }


    @Get()
    findAll() {
        return this.torneoService.findAll();
    }


    @Get(':id/detalle')
    detalle(@Param('id', ParseIntPipe) id: number) {
        return this.torneoService.detalle(id);
    }


    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.torneoService.findOne(id);
    }


    @Put(':id/estado')
    @UseGuards(RolesGuard)
    cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body('estado') estado: string
    ) {
        return this.torneoService.cambiarEstado(id, estado);
    }


    @Delete(':id')
    @UseGuards(RolesGuard)
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.torneoService.eliminar(id);
    }
}