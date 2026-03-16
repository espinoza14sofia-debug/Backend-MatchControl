import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { RolesGuard } from '../auth/roles.guard';


@Controller('equipos')
@UseGuards(RolesGuard)
export class EquipoController {

    constructor(private readonly equipoService: EquipoService) { }


    @Post()
    crear(@Body() dto: any) {
        return this.equipoService.crear(dto);
    }

    @Get()
    findAll() {
        return this.equipoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.equipoService.findOne(+id);
    }

    @Patch(':id')
    actualizar(@Param('id') id: string, @Body() dto: any) {
        return this.equipoService.actualizar(+id, dto);
    }


    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.equipoService.eliminar(+id);
    }
}