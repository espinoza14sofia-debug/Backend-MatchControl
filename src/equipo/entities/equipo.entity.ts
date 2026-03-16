/*
Esta clase representa la estructura de un equipo dentro del sistema.
Se usa para manejar la información básica de cada equipo.
*/
export class Equipo {

  // Id único del equipo
  Id_Equipo: number;

  // Id del usuario que es el capitán del equipo
  Id_Capitan: number;

  // Nombre del equipo
  Nombre: string;

  // Siglas o abreviatura del equipo
  Siglas: string;

  // URL donde se guarda el logo del equipo
  Logo_URL: string;
}