# MatchControl - Sistema de Gestión de Torneos

MatchControl es un sistema para la gestión completa de torneos multicategoría. Permite crear torneos, inscribir participantes individuales o por equipo, programar partidos, registrar resultados por sets o mapas, calcular posiciones automáticamente y aplicar sanciones.

Toda operación de escritura sobre la base de datos se ejecuta exclusivamente a través de Stored Procedures.

---

## Descripción

El sistema está construido con NestJS sobre SQL Server. Cada módulo del backend representa una tabla de la base de datos y expone endpoints REST.

- Las lecturas usan queries directas o vistas.
- Las escrituras (crear, actualizar, eliminar) usan Stored Procedures definidos en el script SQL.

Las tablas `Posiciones` y `Auditoria` son gestionadas automáticamente por triggers de la base de datos y no deben ser modificadas desde el API.

---

## Instrucciones

### Repositorio

```bash
https://github.com/espinoza14sofia-debug/Backend-MatchControl.git
```

### Instalar dependencias

```bash
npm install
```

### Configurar la conexión a la base de datos

Editar `src/app.module.ts`:

```typescript
TypeOrmModule.forRoot({
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'sofi_admin',
  password: '1234',
  database: 'MatchControl',
  synchronize: false,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
})
```

> Credenciales solo para entorno local / desarrollo.



### Iniciar el servidor

```bash
npm run start:dev
```

---

## Herramientas

| Capa           | Tecnología                       |
|----------------|----------------------------------|
| Framework      | NestJS (TypeScript)              |
| Base de datos  | SQL Server (MSSQL)               |
| ORM            | TypeORM con `dataSource.query()` |
| Autenticación  | JWT + RolesGuard                 |
| Frontend       | Vue 3 + Vite (`/matchcontrol-front`) |

---

## Uso

### Endpoints disponibles

```
/rol
/organizacion
/usuario
/categoria
/disciplina
/torneo
/fase
/grupo
/equipo
/equipo-jugador
/participante
/match
/match-participante
/match-set
/posiciones
/sancion
/notificacion
/auditoria
/solicitud-rol
/configuracion-sistema
```

### Autenticación

```
POST /auth/login
```

```json
{
  "nickname": "tu_usuario",
  "password": "tu_password"
}
```

El token JWT obtenido debe enviarse en cada petición:

```
Authorization: Bearer <token>
```

---

## Stored Procedures

El sistema funciona únicamente mediante Stored Procedures para operaciones de escritura.

| Stored Procedure               | Parámetros                                                                                                        | Tabla                 |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------|-----------------------|
| `sp_InsertarUsuario`           | `@IdRol`, `@NombreCompleto`, `@Nickname`, `@Email`, `@PasswordHash`                                               | Usuario               |
| `sp_ActualizarUsuario`         | `@IdUsuario`, `@NombreCompleto`, `@Email`                                                                         | Usuario               |
| `sp_EliminarUsuario`           | `@IdUsuario` — soft delete, pone `Estado = 0`                                                                     | Usuario               |
| `sp_InsertarCategoria`         | `@Nombre`, `@Descripcion`                                                                                         | Categoria             |
| `sp_ActualizarCategoria`       | `@IdCategoria`, `@Nombre`, `@Descripcion`                                                                         | Categoria             |
| `sp_EliminarCategoria`         | `@IdCategoria`                                                                                                    | Categoria             |
| `sp_InsertarDisciplina`        | `@IdCategoria`, `@Nombre`, `@Tipo`, `@Min`, `@Max`                                                                | Disciplina            |
| `sp_ActualizarDisciplina`      | `@IdDisciplina`, `@Nombre`, `@Min`, `@Max`                                                                        | Disciplina            |
| `sp_EliminarDisciplina`        | `@IdDisciplina` — falla si tiene torneos asociados                                                                | Disciplina            |
| `sp_InsertarOrganizacion`      | `@Nombre`, `@Email`, `@Telefono`                                                                                  | Organizacion          |
| `sp_ActualizarOrganizacion`    | `@IdOrganizacion`, `@Nombre`, `@Email`, `@Telefono`                                                               | Organizacion          |
| `sp_EliminarOrganizacion`      | `@IdOrganizacion` — soft delete, pone `Estado = 0`                                                                | Organizacion          |
| `sp_InsertarTorneo`            | `@IdDisciplina`, `@IdOrganizacion`, `@IdCreador`, `@Nombre`, `@Formato`, `@MaxParticipantes`, `@FechaInicio`, `@FechaFin` | Torneo          |
| `sp_ActualizarTorneoEstado`    | `@IdTorneo`, `@Estado`                                                                                            | Torneo                |
| `sp_ConsultarTorneoDetalle`    | `@IdTorneo` — devuelve JOIN con Disciplina y Organización                                                         | Torneo                |
| `sp_EliminarTorneo`            | `@IdTorneo` — elimina en cascada: Sets, Participantes, Matches, Posiciones, Grupos, Fases                         | Torneo                |
| `sp_InsertarFase`              | `@IdTorneo`, `@NombreFase`, `@Orden`, `@TipoFase`                                                                 | Fase                  |
| `sp_ActualizarFase`            | `@IdFase`, `@Nombre`, `@Orden`, `@TipoFase`                                                                       | Fase                  |
| `sp_EliminarFase`              | `@IdFase` — elimina en cascada Matches, Sets, Grupos y Posiciones                                                 | Fase                  |
| `sp_InsertarGrupo`             | `@IdFase`, `@NombreGrupo`                                                                                         | Grupo                 |
| `sp_ActualizarGrupo`           | `@IdGrupo`, `@Nombre`, `@IdFase`                                                                                  | Grupo                 |
| `sp_EliminarGrupo`             | `@IdGrupo`                                                                                                        | Grupo                 |
| `sp_InsertarEquipo`            | `@IdCapitan`, `@Nombre`, `@Siglas`, `@LogoURL`                                                                    | Equipo                |
| `sp_ActualizarEquipo`          | `@IdEquipo`, `@Nombre`, `@Siglas`, `@LogoURL`                                                                     | Equipo                |
| `sp_EliminarEquipo`            | `@IdEquipo`                                                                                                       | Equipo                |
| `sp_AgregarJugadorEquipo`      | `@IdEquipo`, `@IdUsuario`                                                                                         | Equipo_Jugador        |
| `sp_EliminarJugadorEquipo`     | `@IdEquipo`, `@IdUsuario`                                                                                         | Equipo_Jugador        |
| `sp_InscribirParticipante`     | `@IdTorneo`, `@IdEquipo`, `@IdUsuario`, `@Nombre` — valida cupo disponible                                        | Participante          |
| `sp_ActualizarInscripcion`     | `@IdParticipante`, `@Estado`                                                                                      | Participante          |
| `sp_EliminarParticipante`      | `@IdParticipante`                                                                                                 | Participante          |
| `sp_InsertarMatch`             | `@IdFase`, `@Ubicacion`                                                                                           | Match                 |
| `sp_ActualizarMatch`           | `@IdMatch`, `@IdArbitro`, `@FechaHora`, `@Ubicacion`, `@Estado`                                                   | Match                 |
| `sp_EliminarMatch`             | `@IdMatch` — elimina Sets y Match_Participante en cascada                                                         | Match                 |
| `sp_RegistrarResultadoMatch`   | `@IdMatch`, `@IdP1`, `@Score1`, `@IdP2`, `@Score2` — cierra el match como Finalizado                             | Match                 |
| `sp_AsignarParticipanteMatch`  | `@IdMatch`, `@IdParticipante`, `@Lado`                                                                            | Match_Participante    |
| `sp_EliminarParticipanteMatch` | `@IdMatch`, `@IdParticipante`                                                                                     | Match_Participante    |
| `sp_InsertarSet`               | `@IdMatch`, `@Num`, `@Mapa`, `@P1`, `@P2`, `@Ganador`                                                            | Match_Set             |
| `sp_ActualizarSet`             | `@IdMatch`, `@NumeroSet`, `@MapaModo`, `@PuntajeLado1`, `@PuntajeLado2`, `@IdGanadorSet`                          | Match_Set             |
| `sp_EliminarSet`               | `@IdMatch`, `@NumeroSet`                                                                                          | Match_Set             |
| `sp_ConsultarPosiciones`       | `@IdTorneo`                                                                                                       | Posiciones            |
| `sp_ObtenerTablaPosiciones`    | `@Id_Torneo` — incluye nombre del participante                                                                    | Posiciones            |
| `sp_InsertarSancion`           | `@IdTorneo`, `@IdPart`, `@Tipo`, `@Motivo`                                                                        | Sancion               |
| `sp_ActualizarSancion`         | `@IdSancion`, `@TipoSancion`, `@Motivo`                                                                           | Sancion               |
| `sp_EliminarSancion`           | `@IdSancion`                                                                                                      | Sancion               |
| `sp_InsertarNotificacion`      | `@IdUsuario`, `@Titulo`, `@Mensaje`                                                                               | Notificacion          |
| `sp_MarcarNotificacionLeida`   | `@IdNotificacion`                                                                                                 | Notificacion          |
| `sp_EliminarNotificacion`      | `@IdNotificacion`                                                                                                 | Notificacion          |
| `sp_InsertarConfiguracion`     | `@Clave`, `@Valor`, `@Descripcion`                                                                                | Configuracion_Sistema |
| `sp_ActualizarConfiguracion`   | `@IdConfig`, `@Valor`, `@Descripcion`                                                                             | Configuracion_Sistema |
| `sp_EliminarConfiguracion`     | `@IdConfig`                                                                                                       | Configuracion_Sistema |
| `sp_InsertarSolicitudRol`      | `@IdUsuario`, `@RolSolicitado`, `@Motivo`                                                                         | Solicitud_Rol         |
| `sp_ProcesarSolicitudRol`      | `@IdSolicitud`, `@Estado`, `@IdOrganizacion`                                                                      | Solicitud_Rol         |

---

## Estado de los módulos

### Rol

| Operación       | Estado actual         | Usa SP |
|-----------------|-----------------------|--------|
| Listar          | `rolRepo.find()`      | Si     |
| Buscar x nombre | `rolRepo.findOneBy()` | Si     |

Los roles son datos maestros fijos. No se crean ni eliminan desde el API.

---

### Organización

| Operación     | Estado actual                    | Usa SP |
|---------------|----------------------------------|--------|
| Crear         | `EXEC sp_InsertarOrganizacion`   | Si     |
| Listar        | `SELECT * FROM Organizacion`     | Si     |
| Buscar por ID | `SELECT WHERE Id_Organizacion`   | Si     |
| Actualizar    | `EXEC sp_ActualizarOrganizacion` | Si     |
| Eliminar      | `EXEC sp_EliminarOrganizacion`   | Si     |

---

### Usuario

| Operación      | Estado actual               | Usa SP |
|----------------|-----------------------------|--------|
| Crear          | `EXEC sp_InsertarUsuario`   | Si     |
| Buscar x nick  | `SELECT WHERE Nickname`     | Si     |
| Buscar x email | `SELECT WHERE Email`        | Si     |
| Buscar por ID  | `SELECT WHERE Id_Usuario`   | Si     |
| Actualizar     | `EXEC sp_ActualizarUsuario` | Si     |
| Eliminar       | `EXEC sp_EliminarUsuario`   | Si     |

---

### Categoría

| Operación     | Estado actual                 | Usa SP |
|---------------|-------------------------------|--------|
| Crear         | `EXEC sp_InsertarCategoria`   | Si     |
| Listar        | `SELECT * FROM Categoria`     | Si     |
| Buscar por ID | `SELECT WHERE Id_Categoria`   | Si     |
| Actualizar    | `EXEC sp_ActualizarCategoria` | Si     |
| Eliminar      | `EXEC sp_EliminarCategoria`   | Si     |

---

### Disciplina

| Operación     | Estado actual                  | Usa SP |
|---------------|--------------------------------|--------|
| Crear         | `EXEC sp_InsertarDisciplina`   | Si     |
| Listar        | `SELECT * FROM Disciplina`     | Si     |
| Buscar por ID | `SELECT WHERE Id_Disciplina`   | Si     |
| Actualizar    | `EXEC sp_ActualizarDisciplina` | Si     |
| Eliminar      | `EXEC sp_EliminarDisciplina`   | Si     |

---

### Torneo

| Operación      | Estado actual                    | Usa SP |
|----------------|----------------------------------|--------|
| Crear          | `EXEC sp_InsertarTorneo`         | Si     |
| Listar         | `SELECT * FROM Torneo`           | Si     |
| Buscar por ID  | `SELECT WHERE Id_Torneo`         | Si     |
| Detalle        | `EXEC sp_ConsultarTorneoDetalle` | Si     |
| Cambiar estado | `EXEC sp_ActualizarTorneoEstado` | Si     |
| Eliminar       | `EXEC sp_EliminarTorneo`         | Si     |

---

### Fase

| Operación       | Estado actual            | Usa SP |
|-----------------|--------------------------|--------|
| Crear           | `EXEC sp_InsertarFase`   | Si     |
| Listar          | `SELECT * FROM Fase`     | Si     |
| Buscar por ID   | `SELECT WHERE Id_Fase`   | Si     |
| Buscar x torneo | `SELECT WHERE Id_Torneo` | Si     |
| Actualizar      | `EXEC sp_ActualizarFase` | Si     |
| Eliminar        | `EXEC sp_EliminarFase`   | Si     |

---

### Grupo

| Operación       | Estado actual             | Usa SP |
|-----------------|---------------------------|--------|
| Crear           | `EXEC sp_InsertarGrupo`   | Si     |
| Listar          | `SELECT * FROM Grupo`     | Si     |
| Buscar por ID   | `SELECT WHERE Id_Grupo`   | Si     |
| Buscar x fase   | `SELECT WHERE Id_Fase`    | Si     |
| Actualizar      | `EXEC sp_ActualizarGrupo` | Si     |
| Eliminar        | `EXEC sp_EliminarGrupo`   | Si     |

---

### Equipo

| Operación     | Estado actual              | Usa SP |
|---------------|----------------------------|--------|
| Crear         | `EXEC sp_InsertarEquipo`   | Si     |
| Listar        | `SELECT * FROM Equipo`     | Si     |
| Buscar por ID | `SELECT WHERE Id_Equipo`   | Si     |
| Actualizar    | `EXEC sp_ActualizarEquipo` | Si     |
| Eliminar      | `EXEC sp_EliminarEquipo`   | Si     |

---

### Equipo_Jugador

| Operación         | Estado actual                   | Usa SP |
|-------------------|---------------------------------|--------|
| Agregar jugador   | `EXEC sp_AgregarJugadorEquipo`  | Si     |
| Listar todos      | `SELECT * FROM Equipo_Jugador`  | Si     |
| Miembros x equipo | `SELECT JOIN Usuario`           | Si     |
| Eliminar          | `EXEC sp_EliminarJugadorEquipo` | Si     |

---

### Participante

| Operación     | Estado actual                   | Usa SP |
|---------------|---------------------------------|--------|
| Crear         | `EXEC sp_InscribirParticipante` | Si     |
| Listar        | `SELECT * FROM Participante`    | Si     |
| Buscar por ID | `SELECT WHERE Id_Participante`  | Si     |
| Actualizar    | `EXEC sp_ActualizarInscripcion` | Si     |
| Eliminar      | `EXEC sp_EliminarParticipante`  | Si     |

---

### Match

| Operación     | Estado actual             | Usa SP |
|---------------|---------------------------|--------|
| Crear         | `EXEC sp_InsertarMatch`   | Si     |
| Listar        | `SELECT * FROM Match`     | Si     |
| Buscar por ID | `SELECT WHERE Id_Match`   | Si     |
| Buscar x fase | `SELECT WHERE Id_Fase`    | Si     |
| Actualizar    | `EXEC sp_ActualizarMatch` | Si     |
| Eliminar      | `EXEC sp_EliminarMatch`   | Si     |

---

### Match_Participante

| Operación           | Estado actual                       | Usa SP |
|---------------------|-------------------------------------|--------|
| Asignar             | `EXEC sp_AsignarParticipanteMatch`  | Si     |
| Buscar x match      | `SELECT JOIN Participante`          | Si     |
| Registrar resultado | `EXEC sp_RegistrarResultadoMatch`   | Si     |
| Eliminar            | `EXEC sp_EliminarParticipanteMatch` | Si     |

---

### Match_Set

| Operación     | Estado actual           | Usa SP |
|---------------|-------------------------|--------|
| Crear         | `EXEC sp_InsertarSet`   | Si     |
| Ver x match   | `SELECT WHERE Id_Match` | Si     |
| Actualizar    | `EXEC sp_ActualizarSet` | Si     |
| Eliminar      | `EXEC sp_EliminarSet`   | Si     |

---

### Posiciones

| Operación           | Estado actual                    | Usa SP     |
|---------------------|----------------------------------|------------|
| Listar todas        | `SELECT * FROM Posiciones`       | Si         |
| Posiciones x torneo | `EXEC sp_ObtenerTablaPosiciones` | Si         |
| Crear / Actualizar  | Trigger automático               | Automatico |

La tabla Posiciones es gestionada automáticamente por los triggers `trg_AutoCrearPosicion` y `trg_ActualizarTablaPosiciones`. No se escribe desde el API.

---

### Sanción

| Operación       | Estado actual               | Usa SP |
|-----------------|-----------------------------|--------|
| Crear           | `EXEC sp_InsertarSancion`   | Si     |
| Listar todas    | `SELECT * FROM Sancion`     | Si     |
| Listar x torneo | `SELECT WHERE Id_Torneo`    | Si     |
| Actualizar      | `EXEC sp_ActualizarSancion` | Si     |
| Eliminar        | `EXEC sp_EliminarSancion`   | Si     |

---

### Notificación

| Operación        | Estado actual                     | Usa SP |
|------------------|-----------------------------------|--------|
| Crear            | `EXEC sp_InsertarNotificacion`    | Si     |
| Listar todas     | `SELECT * FROM Notificacion`      | Si     |
| Listar x usuario | `SELECT WHERE Id_Usuario`         | Si     |
| Marcar leida     | `EXEC sp_MarcarNotificacionLeida` | Si     |
| Eliminar         | `EXEC sp_EliminarNotificacion`    | Si     |

---

### Auditoría

| Operación        | Estado actual             | Usa SP     |
|------------------|---------------------------|------------|
| Listar todas     | `SELECT * FROM Auditoria` | Si         |
| Listar x usuario | `SELECT WHERE Id_Usuario` | Si         |
| Escribir         | Trigger automático        | Automatico |

La tabla Auditoría es gestionada automáticamente por los triggers `trg_AuditoriaUsuarios` y `trg_AuditoriaEliminacionTorneo`. No se escribe desde el API.

---

### Solicitud_Rol

| Operación      | Estado actual                  | Usa SP |
|----------------|--------------------------------|--------|
| Crear          | `EXEC sp_InsertarSolicitudRol` | Si     |
| Ver pendientes | `SELECT WHERE Estado`          | Si     |
| Procesar       | `EXEC sp_ProcesarSolicitudRol` | Si     |

---

### Configuración del Sistema

| Operación      | Estado actual                     | Usa SP |
|----------------|-----------------------------------|--------|
| Crear          | `EXEC sp_InsertarConfiguracion`   | Si     |
| Listar         | `SELECT * FROM Configuracion_...` | Si     |
| Buscar por ID  | `SELECT WHERE Id_Config`          | Si     |
| Buscar x clave | `SELECT WHERE Clave`              | Si     |
| Actualizar     | `EXEC sp_ActualizarConfiguracion` | Si     |
| Eliminar       | `EXEC sp_EliminarConfiguracion`   | Si     |

---

## Objetos en la base de datos

| Tipo                | Cantidad |
|---------------------|----------|
| Tablas              | 18       |
| Stored Procedures   | 52       |
| Funciones escalares | 5        |
| Vistas              | 6        |
| Triggers            | 7        |
| Indices             | 4        |