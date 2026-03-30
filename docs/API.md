# API — MatchControl

Base URL: `http://localhost:3000`

La mayoría de endpoints están protegidos con `RolesGuard`. Los roles disponibles son: **Admin**, **Organizador**, **Árbitro** y **Participante**.

## Auth
**Base route:** `/auth`  
Público, no requiere autenticación.

- **POST** `/auth/login` — Inicia sesión y retorna un token JWT
  - Body: `{ "nickname": "string", "password": "string" }`
  - Response: `{ access_token, usuario: { id, nickname, nombreCompleto, email, idOrganizacion, rol } }`

## Usuarios
**Base route:** `/usuarios`  
Público, no requiere autenticación.

- **POST** `/usuarios` — Registra un nuevo usuario
  - Body: `{ "nombreCompleto", "nickname", "email", "passwordHash", "idRol" }`
  - Response: `{ mensaje, id, nickname }`
  - Lanza `409` si el nickname o email ya están en uso

## Rol
**Base route:** `/rol`  
Roles requeridos: **Admin**

- **GET** `/rol` — Retorna todos los roles
- **PATCH** `/rol/:id` — Actualiza un rol
  - Body: datos a modificar

## Organización
**Base route:** `/organizacion`  
Protegido con `RolesGuard`

- **POST** `/organizacion` — Crea una organización *(Admin)*
  - Body: datos de la organización
- **GET** `/organizacion` — Lista todas las organizaciones *(Admin, Organizador)*
- **DELETE** `/organizacion/:id` — Elimina una organización *(Admin)*

## Categoría
**Base route:** `/categoria`  
Protegido con `RolesGuard`

- **POST** `/categoria` — Crea una categoría
  - Body: datos de la categoría
- **GET** `/categoria` — Lista todas las categorías
- **GET** `/categoria/:id` — Retorna una categoría por ID
- **DELETE** `/categoria/:id` — Elimina una categoría

## Disciplina
**Base route:** `/disciplina`  
Protegido con `RolesGuard`

- **POST** `/disciplina` — Crea una disciplina
  - Body: datos de la disciplina
- **GET** `/disciplina` — Lista todas las disciplinas
- **DELETE** `/disciplina/:id` — Elimina una disciplina

## Torneo
**Base route:** `/torneo`  
Protegido con `RolesGuard`

- **POST** `/torneo` — Crea un torneo
  - Body: datos del torneo
- **GET** `/torneo` — Lista todos los torneos
- **GET** `/torneo/:id` — Retorna un torneo por ID
- **PATCH** `/torneo/:id/estado` — Cambia el estado del torneo
  - Body: `{ "estado": "Borrador" | "Inscripciones" | "En Curso" | "Finalizado" | "Cancelado" }`
- **DELETE** `/torneo/:id` — Elimina un torneo

## Fase
**Base route:** `/fases`  
Protegido con `RolesGuard`

- **POST** `/fases` — Crea una fase
  - Body: datos de la fase
- **GET** `/fases` — Lista todas las fases
- **GET** `/fases/:id` — Retorna una fase por ID
- **GET** `/fases/torneo/:id` — Retorna las fases de un torneo
- **PATCH** `/fases/:id` — Actualiza una fase
  - Body: datos a modificar
- **DELETE** `/fases/:id` — Elimina una fase

## Grupo
**Base route:** `/grupos`  
Protegido con `RolesGuard`

- **POST** `/grupos` — Crea un grupo
  - Body: datos del grupo
- **GET** `/grupos` — Lista todos los grupos
- **GET** `/grupos/:id` — Retorna un grupo por ID
- **GET** `/grupos/fase/:id` — Retorna los grupos de una fase
- **PATCH** `/grupos/:id` — Actualiza un grupo
  - Body: datos a modificar
- **DELETE** `/grupos/:id` — Elimina un grupo

## Match
**Base route:** `/matches`  
Protegido con `RolesGuard`

- **POST** `/matches` — Crea un partido
  - Body: datos del partido
- **GET** `/matches` — Lista todos los partidos
- **GET** `/matches/:id` — Retorna un partido por ID
- **GET** `/matches/fase/:id` — Retorna los partidos de una fase
- **PATCH** `/matches/:id` — Actualiza un partido
  - Body: datos a modificar
- **DELETE** `/matches/:id` — Elimina un partido

## Match Participante
**Base route:** `/match-participantes`  
Protegido con `RolesGuard`

- **POST** `/match-participantes` — Asigna un participante a un partido
  - Body: datos de la asignación
- **GET** `/match-participantes/match/:id` — Retorna los participantes de un partido
- **PATCH** `/match-participantes/:idMatch/:idPart` — Actualiza resultado de un participante
  - Body: datos a modificar
- **DELETE** `/match-participantes/:idMatch/:idPart` — Elimina un participante de un partido

## Match Set
**Base route:** `/match-set`  
Protegido con `RolesGuard`

- **POST** `/match-set` — Crea un set *(Admin, Árbitro)*
  - Body: datos del set
- **GET** `/match-set/match/:id` — Retorna los sets de un partido *(Admin, Organizador, Árbitro, Participante)*
- **PATCH** `/match-set/:idMatch/:numSet` — Actualiza un set *(Admin, Árbitro)*
  - Body: datos a modificar
- **DELETE** `/match-set/:idMatch/:numSet` — Elimina un set *(Admin)*

## Equipo
**Base route:** `/equipos`  
Protegido con `RolesGuard`

- **POST** `/equipos` — Crea un equipo
  - Body: datos del equipo
- **GET** `/equipos` — Lista todos los equipos
- **GET** `/equipos/:id` — Retorna un equipo por ID
- **PATCH** `/equipos/:id` — Actualiza un equipo
  - Body: datos a modificar
- **DELETE** `/equipos/:id` — Elimina un equipo

## Participante
**Base route:** `/participantes`  
Protegido con `RolesGuard`

- **POST** `/participantes` — Inscribe un participante
  - Body: datos del participante
- **GET** `/participantes` — Lista todos los participantes
- **GET** `/participantes/:id` — Retorna un participante por ID
- **PATCH** `/participantes/:id` — Actualiza un participante
  - Body: datos a modificar
- **DELETE** `/participantes/:id` — Elimina un participante

## Posiciones
**Base route:** `/posiciones`  
Sin guard explícito, acceso abierto.

- **GET** `/posiciones` — Lista todas las posiciones
- **GET** `/posiciones/torneo/:id` — Retorna las posiciones de un torneo
- **POST** `/posiciones` — Crea un registro de posición
  - Body: datos de la posición
- **PATCH** `/posiciones/:id` — Actualiza una posición
  - Body: datos a modificar
- **DELETE** `/posiciones/:id` — Elimina una posición

## Notificación
**Base route:** `/notificaciones`  
Sin guard explícito, acceso abierto.

- **GET** `/notificaciones` — Lista todas las notificaciones
- **GET** `/notificaciones/usuario/:id` — Retorna las notificaciones de un usuario
- **POST** `/notificaciones` — Crea una notificación
  - Body: datos de la notificación
- **PATCH** `/notificaciones/leer/:id` — Marca una notificación como leída
- **DELETE** `/notificaciones/:id` — Elimina una notificación

## Sanción
**Base route:** `/sanciones`  
Protegido con `RolesGuard`

- **GET** `/sanciones` — Lista todas las sanciones *(Admin, Organizador, Árbitro)*
- **GET** `/sanciones/torneo/:id` — Retorna las sanciones de un torneo *(Admin, Organizador, Árbitro, Participante)*
- **POST** `/sanciones` — Crea una sanción *(Admin, Organizador)*
  - Body: datos de la sanción
- **PATCH** `/sanciones/:id` — Actualiza una sanción
  - Body: datos a modificar
- **DELETE** `/sanciones/:id` — Elimina una sanción *(Admin)*

## Solicitud de Rol
**Base route:** `/solicitudes`  
Protegido con `JwtAuthGuard` y `RolesGuard`

- **POST** `/solicitudes/pedir` — Solicita un cambio de rol *(Participante)*
  - Body: datos de la solicitud
- **GET** `/solicitudes/pendientes` — Lista solicitudes pendientes *(Admin)*
- **PATCH** `/solicitudes/decidir/:idSolicitud` — Aprueba o rechaza una solicitud *(Admin)*
  - Body: `{ "estado": "Aprobado" | "Rechazado", "idOrganizacion"?: number }`

## Auditoría
**Base route:** `/auditoria`  
Roles requeridos: **Admin**

- **GET** `/auditoria` — Retorna todos los registros de auditoría
- **GET** `/auditoria/usuario/:id` — Retorna los registros de un usuario

## Configuración del Sistema
**Base route:** `/configuracion_sistema`  
Roles requeridos: **Admin**

- **GET** `/configuracion_sistema` — Lista todas las configuraciones
- **GET** `/configuracion_sistema/:id` — Retorna una configuración por ID
- **POST** `/configuracion_sistema` — Crea una configuración
  - Body: `{ "clave", "valor", "descripcion" }`
- **PATCH** `/configuracion_sistema/:id` — Actualiza una configuración
  - Body: datos a modificar