import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { EquipoJugadorService } from './equipo_jugador.service';
import { RolesGuard } from '../auth/roles.guard';

// Controlador que maneja las rutas relacionadas con los jugadores de un equipo
@Controller('equipo-jugadores')

// Se usa el guard para validar el acceso según el usuario
@UseGuards(RolesGuard)
export class EquipoJugadorController {

  // Se inyecta el servicio de equipo-jugador
  constructor(private readonly equipoJugadorService: EquipoJugadorService) { }

  // Endpoint para agregar un jugador a un equipo
  @Post()
  agregar(@Body() dto: any) {
    return this.equipoJugadorService.agregarJugador(dto);
  }

  // Endpoint para obtener todas las relaciones equipo-jugador
  @Get()  
  findAll() {
    return this.equipoJugadorService.findAll();
  }

  // Endpoint para obtener todos los miembros de un equipo específico
  @Get('equipo/:id')
  obtenerMiembros(@Param('id') id: string) {
    return this.equipoJugadorService.obtenerMiembros(+id);
  }

  // Endpoint para actualizar el equipo al que pertenece un jugador
  @Patch(':idEq/:idUs')
  actualizar(
    @Param('idEq') idEq: string,
    @Param('idUs') idUs: string,
    @Body('nuevoIdEquipo') nuevoId: number
  ) {
    return this.equipoJugadorService.actualizar(+idEq, +idUs, nuevoId);
  }

  // Endpoint para eliminar un jugador de un equipo
  @Delete(':idEq/:idUs')
  eliminar(@Param('idEq') idEq: string, @Param('idUs') idUs: string) {
    return this.equipoJugadorService.eliminar(+idEq, +idUs);
  }
}