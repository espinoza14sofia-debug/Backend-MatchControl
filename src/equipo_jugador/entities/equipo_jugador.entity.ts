/*
Esta clase representa la relación entre un equipo y sus jugadores.
Se usa para saber qué usuarios pertenecen a un equipo.
*/
export class EquipoJugador {

  // Id del equipo al que pertenece el jugador
  Id_Equipo: number;

  // Id del usuario que forma parte del equipo
  Id_Usuario: number;

  // Fecha en que el jugador se unió al equipo
  Fecha_Union: Date;
}