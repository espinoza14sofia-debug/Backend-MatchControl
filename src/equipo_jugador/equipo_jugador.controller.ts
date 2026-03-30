import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { EquipoJugadorService } from './equipo_jugador.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('equipo-jugadores')
export class EquipoJugadorController {

  constructor(private readonly equipoJugadorService: EquipoJugadorService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  agregar(@Body() dto: any) {
    return this.equipoJugadorService.agregarJugador(dto);
  }

  @Get()
  findAll() {
    return this.equipoJugadorService.findAll();
  }

  @Get('equipo/:id')
  obtenerMiembros(@Param('id') id: string) {
    return this.equipoJugadorService.obtenerMiembros(+id);
  }

  @Patch(':idEq/:idUs')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  actualizar(
    @Param('idEq') idEq: string,
    @Param('idUs') idUs: string,
    @Body('nuevoIdEquipo') nuevoId: number
  ) {
    return this.equipoJugadorService.actualizar(+idEq, +idUs, nuevoId);
  }

  @Delete(':idEq/:idUs')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  eliminar(@Param('idEq') idEq: string, @Param('idUs') idUs: string) {
    return this.equipoJugadorService.eliminar(+idEq, +idUs);
  }
}