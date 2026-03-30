# Documentación de Base de Datos - MatchControl
Base de datos desarrollada en Microsoft SQL Server
Proyecto: Sistema de Gestión de Torneos Multicategoría.

## Base de Datos — MatchControl

### Rol
Define los tipos de usuario del sistema.

- **Id_Rol** `INT` — Clave primaria
- **Nombre** `NVARCHAR(50)` — Nombre único del rol
- **Descripcion** `NVARCHAR(255)` — Descripción del rol

### Organizacion
Organizaciones que crean o administran torneos.

- **Id_Organizacion** `INT` — Clave primaria
- **Nombre** `NVARCHAR(100)` — Nombre único
- **Email** `NVARCHAR(100)` — Correo de contacto
- **Telefono** `NVARCHAR(20)` — Teléfono de contacto
- **Estado** `BIT` — Activo (1) / Inactivo (0)
- **Fecha_Creacion** `DATETIME` — Fecha de registro

### Usuario
Todos los usuarios del sistema. Cada uno tiene un rol y puede pertenecer a una organización.

- **Id_Usuario** `INT` — Clave primaria
- **Id_Rol** `INT` — FK -> `Rol`
- **Id_Organizacion** `INT` — FK -> `Organizacion` (opcional)
- **Nombre_Completo** `NVARCHAR(150)` — Nombre real del usuario
- **Nickname** `NVARCHAR(50)` — Alias único
- **Email** `NVARCHAR(100)` — Correo único
- **Password_Hash** `NVARCHAR(MAX)` — Contraseña encriptada
- **Estado** `BIT` — Activo (1) / Inactivo (0)
- **Fecha_Registro** `DATETIME` — Fecha de creación

### Categoria
Clasifica las disciplinas en grupos generales.

- **Id_Categoria** `INT` — Clave primaria
- **Nombre** `NVARCHAR(50)` — Nombre único
- **Descripcion** `NVARCHAR(200)` — Descripción de la categoría

### Disciplina
Juegos o deportes específicos dentro de una categoría.

- **Id_Disciplina** `INT` — Clave primaria
- **Id_Categoria** `INT` — FK -> `Categoria`
- **Nombre** `NVARCHAR(50)` — Nombre de la disciplina
- **Tipo_Participacion** `NVARCHAR(20)` — `Individual`, `Equipo` o `Ambos`
- **Min_Integrantes** `INT` — Mínimo de jugadores por equipo
- **Max_Integrantes** `INT` — Máximo de jugadores por equipo

### Configuracion_Sistema
Parámetros generales configurables del sistema.

- **Id_Config** `INT` — Clave primaria
- **Clave** `NVARCHAR(50)` — Identificador único del parámetro
- **Valor** `NVARCHAR(MAX)` — Valor del parámetro
- **Descripcion** `NVARCHAR(255)` — Descripción del parámetro

### Torneo
Tabla central del sistema. Contiene toda la información de cada torneo.

- **Id_Torneo** `INT` — Clave primaria
- **Id_Disciplina** `INT` — FK -> `Disciplina`
- **Id_Organizacion** `INT` — FK -> `Organizacion`
- **Id_Creador** `INT` — FK -> `Usuario`
- **Nombre** `NVARCHAR(150)` — Nombre del torneo
- **Estado** `NVARCHAR(20)` — `Borrador`, `Inscripciones`, `En Curso`, `Finalizado`, `Cancelado`
- **Formato** `NVARCHAR(30)` — `Eliminacion Directa`, `Round Robin`, `Grupos`, `Suizo`
- **Max_Participantes** `INT` — Cupo máximo
- **Puntos_Victoria** `INT` — Puntos por ganar (default 3)
- **Puntos_Empate** `INT` — Puntos por empate (default 1)
- **Puntos_Derrota** `INT` — Puntos por perder (default 0)
- **Es_Publico** `BIT` — Visibilidad pública
- **Requiere_Aprobacion** `BIT` — Si las inscripciones necesitan aprobación
- **Fecha_Inicio** `DATETIME` — Inicio del torneo
- **Fecha_Fin** `DATETIME` — Fin del torneo
- **Fecha_Creacion** `DATETIME` — Fecha de creación

### Fase
Divide el torneo en etapas (grupos, semifinal, final, etc.).

- **Id_Fase** `INT` — Clave primaria
- **Id_Torneo** `INT` — FK -> `Torneo`
- **Nombre** `NVARCHAR(50)` — Nombre de la fase
- **Orden** `INT` — Orden dentro del torneo
- **Tipo_Fase** `NVARCHAR(30)` — `Grupos`, `Eliminacion`, `Round Robin`

### Grupo
Grupos dentro de una fase.

- **Id_Grupo** `INT` — Clave primaria
- **Id_Fase** `INT` — FK -> `Fase`
- **Nombre** `NVARCHAR(30)` — Nombre del grupo (ej. Grupo A)

### Equipo
Equipos que participan en torneos.

- **Id_Equipo** `INT` — Clave primaria
- **Id_Capitan** `INT` — FK -> `Usuario`
- **Nombre** `NVARCHAR(100)` — Nombre del equipo
- **Siglas** `NVARCHAR(10)` — Abreviación (ej. TSM)
- **Logo_URL** `NVARCHAR(MAX)` — URL del logo

### Equipo_Jugador
Relación entre jugadores y equipos.

- **Id_Equipo** `INT` — PK compuesta, FK -> `Equipo`
- **Id_Usuario** `INT` — PK compuesta, FK -> `Usuario`
- **Fecha_Union** `DATETIME` — Fecha en que se unió al equipo

### Participante
Registra quién participa en un torneo. Puede ser un usuario individual o un equipo, nunca ambos.

- **Id_Participante** `INT` — Clave primaria
- **Id_Torneo** `INT` — FK -> `Torneo`
- **Id_Usuario** `INT` — FK -> `Usuario` (null si es equipo)
- **Id_Equipo** `INT` — FK -> `Equipo` (null si es individual)
- **Nombre_En_Torneo** `NVARCHAR(100)` — Nombre con el que compite
- **Estado_Inscripcion** `NVARCHAR(20)` — `Pendiente`, `Aceptado`, `Rechazado`
- **Fecha_Registro** `DATETIME` — Fecha de inscripción

### Match
Partidos programados del torneo.

- **Id_Match** `INT` — Clave primaria
- **Id_Fase** `INT` — FK -> `Fase`
- **Id_Grupo** `INT` — FK -> `Grupo` (opcional)
- **Id_Arbitro** `INT` — FK -> `Usuario` (opcional)
- **Fecha_Hora** `DATETIME` — Fecha y hora del partido
- **Ubicacion** `NVARCHAR(200)` — Lugar del partido
- **Estado** `NVARCHAR(20)` — `Programado`, `En Juego`, `Finalizado`, `Postpuesto`

### Match_Participante
Relaciona los participantes con cada partido y guarda el resultado.

- **Id_Match** `INT` — PK compuesta, FK -> `Match`
- **Id_Participante** `INT` — PK compuesta, FK -> `Participante`
- **Lado** `INT` — `1` o `2` (posición en el enfrentamiento)
- **Es_Ganador** `BIT` — Si este participante ganó
- **Score_Final** `INT` — Puntuación final

### Match_Set
Sets o rondas internas dentro de un partido.

- **Id_Set** `INT` — Clave primaria
- **Id_Match** `INT` — FK -> `Match`
- **Numero_Set** `INT` — Número del set
- **Mapa_Modo** `NVARCHAR(100)` — Mapa o modo de juego
- **Puntaje_Lado1** `INT` — Puntaje del lado 1
- **Puntaje_Lado2** `INT` — Puntaje del lado 2
- **Id_Ganador_Set** `INT` — Ganador del set

### Posiciones
Tabla de posiciones por fase o grupo.

- **Id_Posicion** `INT` — Clave primaria
- **Id_Fase** `INT` — FK -> `Fase`
- **Id_Grupo** `INT` — FK -> `Grupo` (opcional)
- **Id_Participante** `INT` — FK -> `Participante`
- **Puntos** `INT` — Puntos acumulados
- **PJ** `INT` — Partidos jugados
- **PG** `INT` — Partidos ganados
- **PE** `INT` — Partidos empatados
- **PP** `INT` — Partidos perdidos
- **Score_Favor** `INT` — Puntos a favor
- **Score_Contra** `INT` — Puntos en contra

### Auditoria
Registro de todas las acciones realizadas por los usuarios.

- **Id_Auditoria** `BIGINT` — Clave primaria
- **Fecha** `DATETIME` — Fecha y hora de la acción
- **Id_Usuario** `INT` — FK -> `Usuario`
- **Accion** `NVARCHAR(50)` — Tipo de acción (INSERT, UPDATE, DELETE)
- **Tabla** `NVARCHAR(50)` — Tabla afectada
- **Valores_Anteriores** `NVARCHAR(MAX)` — Estado previo del registro
- **Valores_Nuevos** `NVARCHAR(MAX)` — Estado nuevo del registro
- **IP_Address** `NVARCHAR(45)` — IP del usuario

### Sancion
Sanciones aplicadas a participantes en un torneo.

- **Id_Sancion** `INT` — Clave primaria
- **Id_Torneo** `INT` — FK -> `Torneo`
- **Id_Participante** `INT` — FK -> `Participante`
- **Tipo_Sancion** `NVARCHAR(30)` — `Advertencia`, `Suspension`, `Descalificacion`
- **Motivo** `NVARCHAR(500)` — Razón de la sanción
- **Fecha_Sancion** `DATETIME` — Fecha de aplicación

### Notificacion
Notificaciones enviadas a los usuarios del sistema.

- **Id_Notificacion** `BIGINT` — Clave primaria
- **Id_Usuario** `INT` — FK -> `Usuario`
- **Titulo** `NVARCHAR(100)` — Título de la notificación
- **Mensaje** `NVARCHAR(500)` — Contenido del mensaje
- **Leido** `BIT` — Leído (1) / No leído (0)
- **Fecha_Envio** `DATETIME` — Fecha de envío