import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TorneoService } from './torneo.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport'; // <--- IMPORTANTE: Importar esto

@Controller('torneo')
export class TorneoController {

    constructor(private readonly torneoService: TorneoService) { }

    @Post()
    // Primero validamos el Token, luego el Rol
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    crear(@Body() dto: any) {
        return this.torneoService.crear(dto);
    }

    @Get()
    // Dejamos el Get libre para que el Dashboard no de error 401
    findAll() {
        return this.torneoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.torneoService.findOne(id);
    }

    @Patch(':id/estado')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body('estado') estado: string
    ) {
        return this.torneoService.cambiarEstado(id, estado);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.torneoService.eliminar(id);
    }
}