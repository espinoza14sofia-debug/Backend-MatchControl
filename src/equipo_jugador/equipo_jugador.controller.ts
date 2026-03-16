import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { EquipoJugadorService } from './equipo_jugador.service';
import { RolesGuard } from '../auth/roles.guard';


@Controller('equipo-jugadores')


@UseGuards(RolesGuard)
export class EquipoJugadorController {


  constructor(private readonly equipoJugadorService: EquipoJugadorService) { }

  @Post()
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
  actualizar(
    @Param('idEq') idEq: string,
    @Param('idUs') idUs: string,
    @Body('nuevoIdEquipo') nuevoId: number
  ) {
    return this.equipoJugadorService.actualizar(+idEq, +idUs, nuevoId);
  }


  @Delete(':idEq/:idUs')
  eliminar(@Param('idEq') idEq: string, @Param('idUs') idUs: string) {
    return this.equipoJugadorService.eliminar(+idEq, +idUs);
  }
}