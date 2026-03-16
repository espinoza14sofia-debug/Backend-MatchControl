import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TorneoService } from './torneo.service';
import { RolesGuard } from '../auth/roles.guard';

@Controller('torneo')
@UseGuards(RolesGuard)
export class TorneoController {

    constructor(private readonly torneoService: TorneoService) { }


    @Post()
    crear(@Body() dto: any) {
        return this.torneoService.crear(dto);
    }


    @Get()
    findAll() {
        return this.torneoService.findAll();
    }


    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.torneoService.findOne(id);
    }


    @Patch(':id/estado')
    cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body('estado') estado: string
    ) {
        return this.torneoService.cambiarEstado(id, estado);
    }


    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.torneoService.eliminar(id);
    }
}