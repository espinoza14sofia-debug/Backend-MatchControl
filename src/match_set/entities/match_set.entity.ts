// Modelo que representa un set dentro de un partido
export class MatchSet {

    // Identificador del set
    Id_Set: number;

    // Partido al que pertenece el set
    Id_Match: number;

    // Número del set dentro del partido
    Numero_Set: number;

    // Nombre del mapa o modo de juego
    Mapa_Modo: string;

    // Puntaje del lado 1
    Puntaje_Lado1: number;

    // Puntaje del lado 2
    Puntaje_Lado2: number;

    // Participante ganador del set
    Id_Ganador_Set: number;
}