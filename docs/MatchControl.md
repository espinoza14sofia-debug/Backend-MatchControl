# MatchControl - Sistema de Gestion de Torneos

MatchControl es un sistema para la gestion completa de torneos multicategoria. Permite crear torneos, inscribir participantes individuales o por equipo, programar partidos, registrar resultados por sets o mapas, calcular posiciones automaticamente y aplicar sanciones. Toda operacion de escritura sobre la base de datos se ejecuta exclusivamente a traves de Stored Procedures.

---

## Descripcion

El sistema esta construido con NestJS sobre SQL Server. Cada modulo del backend representa una tabla de la base de datos y expone endpoints REST. Las lecturas usan queries directas o vistas. Las escrituras (crear, actualizar, eliminar) usan Stored Procedures definidos en el script SQL del proyecto.

La tabla `Posiciones` y la tabla `Auditoria` son gestionadas automaticamente por triggers de la base de datos y no se escriben desde el API.

---

## Instrucciones

###  repositorio

```bash
https://github.com/espinoza14sofia-debug/Backend-MatchControl.git
```

### Instalar dependencias

```bash
npm install
```

### Configurar la conexion a la base de datos

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

### Ejecutar el script SQL

Correr el archivo `Scripts_SQL_organizados_-_Completo.sql` en SQL Server para crear la base de datos, todas las tablas, SPs, funciones, vistas y triggers.

### Iniciar el servidor

```bash
npm run start:dev
```

---

## Herramientas

| Capa          | Tecnologia                     |
|---------------|--------------------------------|
| Framework     | NestJS (TypeScript)            |
| Base de datos | SQL Server (MSSQL)             |
| ORM           | TypeORM con dataSource.query() |
| Autenticacion | JWT + RolesGuard               |
| Frontend      | Vue 3 + Vite (/matchcontrol-front) |

---

## Uso

El API expone los siguientes modulos. Cada uno corresponde a una tabla de la base de datos.

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

La autenticacion se realiza en `/auth/login` con `nickname` y `password`. El token JWT resultante debe enviarse en el header `Authorization: Bearer <token>` en todas las demas peticiones.

---

## Stored Procedures existentes en la base de datos

Estos son todos los SPs definidos en el script SQL. El proyecto debe funcionar unicamente a traves de ellos.

| Stored Procedure             | Parametros                                                                                    | Tabla       |
|------------------------------|-----------------------------------------------------------------------------------------------|-------------|
| sp_InsertarUsuario           | @IdRol, @NombreCompleto, @Nickname, @Email, @PasswordHash                                     | Usuario     |
| sp_ActualizarUsuario         | @IdUsuario, @NombreCompleto, @Email                                                           | Usuario     |
| sp_EliminarUsuario           | @IdUsuario — soft delete, pone Estado = 0                                                     | Usuario     |
| sp_InsertarDisciplina        | @IdCategoria, @Nombre, @Tipo, @Min, @Max                                                      | Disciplina  |
| sp_ActualizarDisciplina      | @IdDisciplina, @Nombre, @Min, @Max                                                            | Disciplina  |
| sp_EliminarDisciplina        | @IdDisciplina — falla si tiene torneos asociados                                              | Disciplina  |
| sp_InsertarTorneo            | @IdDisciplina, @IdOrganizacion, @IdCreador, @Nombre, @Formato, @MaxParticipantes, @FechaInicio, @FechaFin | Torneo |
| sp_ActualizarTorneoEstado    | @IdTorneo, @Estado                                                                            | Torneo      |
| sp_ConsultarTorneoDetalle    | @IdTorneo — devuelve JOIN con Disciplina y Organizacion                                       | Torneo      |
| sp_EliminarTorneo            | @IdTorneo — elimina en cascada: Sets, Participantes de Match, Matches, Posiciones, Grupos, Fases | Torneo   |
| sp_InsertarFase              | @IdTorneo, @NombreFase, @Orden, @TipoFase                                                     | Fase        |
| sp_InscribirParticipante     | @IdTorneo, @IdEquipo, @IdUsuario, @Nombre — valida que haya cupo                              | Participante|
| sp_ActualizarInscripcion     | @IdParticipante, @Estado                                                                      | Participante|
| sp_InsertarMatch             | @IdFase, @Ubicacion                                                                           | Match       |
| sp_RegistrarResultadoMatch   | @IdMatch, @IdP1, @Score1, @IdP2, @Score2 — cierra el match como Finalizado                    | Match       |
| sp_InsertarSet               | @IdMatch, @Num, @Mapa, @P1, @P2, @Ganador                                                    | Match_Set   |
| sp_InsertarSancion           | @IdTorneo, @IdPart, @Tipo, @Motivo                                                            | Sancion     |
| sp_ConsultarPosiciones       | @IdTorneo                                                                                     | Posiciones  |
| sp_ObtenerTablaPosiciones    | @Id_Torneo — incluye nombre del participante                                                  | Posiciones  |
| sp_InsertarOrganizacion      | @Nombre, @Email, @Telefono                                                                    | Organizacion|
| sp_EliminarOrganizacion      | @IdOrganizacion — soft delete, pone Estado = 0                                                | Organizacion|

---

## Estado actual de cada modulo

La siguiente tabla muestra que operaciones de cada modulo ya usan SP y cuales todavia usan queries o repositorios directos y necesitan ser migradas.

### Torneo

| Operacion      | Como esta ahora                    | Con SP |
|----------------|------------------------------------|--------|
| Crear          | EXEC sp_InsertarTorneo             | SI     |
| Listar         | SELECT * FROM Torneo               | SI     |
| Buscar por ID  | SELECT * FROM Torneo WHERE ...     | SI     |
| Cambiar estado | UPDATE Torneo SET Estado = ...     | NO     |
| Eliminar       | EXEC sp_EliminarTorneo             | SI     |
| Detalle        | No implementado                    | NO     |

**Falta:**
- Reemplazar el UPDATE directo de `cambiarEstado` por `sp_ActualizarTorneoEstado`
- Agregar metodo `detalle` que llame a `sp_ConsultarTorneoDetalle`

---

### Organizacion

| Operacion      | Como esta ahora                        | Con SP |
|----------------|----------------------------------------|--------|
| Crear          | EXEC sp_InsertarOrganizacion           | SI     |
| Listar         | orgRepo.find()                         | SI     |
| Buscar por ID  | orgRepo.findOneBy({ id })              | SI     |
| Actualizar     | No implementado                        | NO     |
| Eliminar       | EXEC sp_EliminarOrganizacion           | SI     |

**Falta:**
- El SP `sp_ActualizarOrganizacion` no existe en la base de datos. Hay que crearlo y conectarlo.

SP a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_ActualizarOrganizacion
    @IdOrganizacion INT,
    @Nombre NVARCHAR(100),
    @Email NVARCHAR(100),
    @Telefono NVARCHAR(20)
AS
BEGIN
    UPDATE Organizacion
    SET Nombre = @Nombre, Email = @Email, Telefono = @Telefono
    WHERE Id_Organizacion = @IdOrganizacion;
END
```

Metodo a agregar en `organizacion.service.ts`:
```typescript
async update(id: number, dto: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarOrganizacion @IdOrganizacion=@0, @Nombre=@1, @Email=@2, @Telefono=@3',
        [id, dto.nombre, dto.email, dto.telefono]
    );
}
```

---

### Disciplina

| Operacion      | Como esta ahora               | Con SP |
|----------------|-------------------------------|--------|
| Crear          | EXEC sp_InsertarDisciplina    | SI     |
| Listar         | repo.find()                   | SI     |
| Buscar por ID  | No implementado               | NO     |
| Actualizar     | No implementado               | NO     |
| Eliminar       | EXEC sp_EliminarDisciplina    | SI     |

**Falta:**
- Agregar `findOne` y conectar `sp_ActualizarDisciplina`

```typescript
// Agregar en disciplina.service.ts
async findOne(id: number) {
    const res = await this.dataSource.query(
        'SELECT * FROM Disciplina WHERE Id_Disciplina = @0', [id]
    );
    return res[0];
}

async actualizar(id: number, dto: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarDisciplina @IdDisciplina=@0, @Nombre=@1, @Min=@2, @Max=@3',
        [id, dto.Nombre, dto.Min_Integrantes, dto.Max_Integrantes]
    );
}
```

---

### Usuario

| Operacion      | Como esta ahora                      | Con SP |
|----------------|--------------------------------------|--------|
| Crear          | usuarioRepo.create() + save()        | NO     |
| Buscar x nick  | usuarioRepo.findOne({ nickname })    | SI     |
| Buscar x email | usuarioRepo.findOne({ email })       | SI     |
| Buscar por ID  | usuarioRepo.findOne({ id })          | SI     |
| Actualizar     | No implementado                      | NO     |
| Eliminar       | No implementado                      | NO     |

**Falta:**
- Reemplazar `crear` por `sp_InsertarUsuario`
- Agregar `actualizar` con `sp_ActualizarUsuario`
- Agregar `eliminar` con `sp_EliminarUsuario`

```typescript
// Reemplazar y agregar en usuario.service.ts
async crear(datos: any) {
    return await this.dataSource.query(
        'EXEC sp_InsertarUsuario @IdRol=@0, @NombreCompleto=@1, @Nickname=@2, @Email=@3, @PasswordHash=@4',
        [datos.idRol, datos.nombreCompleto, datos.nickname, datos.email, datos.passwordHash]
    );
}

async actualizar(id: number, dto: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarUsuario @IdUsuario=@0, @NombreCompleto=@1, @Email=@2',
        [id, dto.Nombre_Completo, dto.Email]
    );
}

async eliminar(id: number) {
    return await this.dataSource.query(
        'EXEC sp_EliminarUsuario @IdUsuario=@0', [id]
    );
}
```

---

### Fase

| Operacion       | Como esta ahora                            | Con SP |
|-----------------|--------------------------------------------|--------|
| Crear           | EXEC sp_InsertarFase                       | SI     |
| Listar          | SELECT * FROM Fase                         | SI     |
| Buscar por ID   | SELECT * FROM Fase WHERE Id_Fase = @0      | SI     |
| Buscar x torneo | SELECT * FROM Fase WHERE Id_Torneo = @0    | SI     |
| Actualizar      | UPDATE Fase SET ... WHERE Id_Fase = @0     | NO     |
| Eliminar        | DELETE FROM Fase WHERE Id_Fase = @0        | NO     |

**Falta:**
- El DELETE directo falla si la fase tiene matches, grupos o posiciones. Hay que crear el SP y conectarlo.
- Crear SP para actualizar.

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_ActualizarFase
    @IdFase INT,
    @Nombre NVARCHAR(50),
    @Orden INT,
    @TipoFase NVARCHAR(30)
AS
BEGIN
    UPDATE Fase
    SET Nombre = ISNULL(@Nombre, Nombre),
        Orden = ISNULL(@Orden, Orden),
        Tipo_Fase = ISNULL(@TipoFase, Tipo_Fase)
    WHERE Id_Fase = @IdFase;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarFase
    @IdFase INT
AS
BEGIN
    BEGIN TRANSACTION;
    DELETE FROM Posiciones WHERE Id_Fase = @IdFase;
    DELETE FROM Grupo WHERE Id_Fase = @IdFase;
    DELETE FROM Match_Set WHERE Id_Match IN (
        SELECT Id_Match FROM Match WHERE Id_Fase = @IdFase
    );
    DELETE FROM Match_Participante WHERE Id_Match IN (
        SELECT Id_Match FROM Match WHERE Id_Fase = @IdFase
    );
    DELETE FROM Match WHERE Id_Fase = @IdFase;
    DELETE FROM Fase WHERE Id_Fase = @IdFase;
    COMMIT TRANSACTION;
END
```

```typescript
// Actualizar en fase.service.ts
async actualizar(id: number, dto: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarFase @IdFase=@0, @Nombre=@1, @Orden=@2, @TipoFase=@3',
        [id, dto.Nombre, dto.Orden, dto.Tipo_Fase]
    );
}

async eliminar(id: number) {
    await this.dataSource.query('EXEC sp_EliminarFase @IdFase=@0', [id]);
    return { success: true, message: `Fase ${id} eliminada` };
}
```

---

### Grupo

| Operacion       | Como esta ahora                             | Con SP |
|-----------------|---------------------------------------------|--------|
| Crear           | EXEC sp_InsertarGrupo                       | ROTO   |
| Listar          | SELECT * FROM Grupo                         | SI     |
| Buscar por ID   | SELECT * FROM Grupo WHERE Id_Grupo = @0     | SI     |
| Buscar x fase   | SELECT * FROM Grupo WHERE Id_Fase = @0      | SI     |
| Actualizar      | UPDATE Grupo SET ... WHERE Id_Grupo = @0    | NO     |
| Eliminar        | DELETE FROM Grupo WHERE Id_Grupo = @0       | NO     |

**Atencion:** El service ya llama `EXEC sp_InsertarGrupo` pero ese SP no existe en el script SQL. Crear el grupo actualmente falla.

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_InsertarGrupo
    @IdFase INT,
    @NombreGrupo NVARCHAR(30)
AS
BEGIN
    INSERT INTO Grupo (Id_Fase, Nombre) VALUES (@IdFase, @NombreGrupo);
    SELECT SCOPE_IDENTITY() AS Id_Grupo;
END
GO

CREATE OR ALTER PROCEDURE sp_ActualizarGrupo
    @IdGrupo INT,
    @Nombre NVARCHAR(30),
    @IdFase INT
AS
BEGIN
    UPDATE Grupo
    SET Nombre = ISNULL(@Nombre, Nombre),
        Id_Fase = ISNULL(@IdFase, Id_Fase)
    WHERE Id_Grupo = @IdGrupo;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarGrupo
    @IdGrupo INT
AS
BEGIN
    DELETE FROM Grupo WHERE Id_Grupo = @IdGrupo;
END
```

```typescript
// Actualizar en grupo.service.ts
async actualizar(id: number, dto: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarGrupo @IdGrupo=@0, @Nombre=@1, @IdFase=@2',
        [id, dto.Nombre, dto.Id_Fase]
    );
}

async eliminar(id: number) {
    await this.dataSource.query('EXEC sp_EliminarGrupo @IdGrupo=@0', [id]);
    return { success: true, message: `Grupo ${id} eliminado correctamente` };
}
```

---

### Equipo

| Operacion      | Como esta ahora                               | Con SP |
|----------------|-----------------------------------------------|--------|
| Crear          | INSERT INTO Equipo ...                        | NO     |
| Listar         | SELECT * FROM Equipo                          | SI     |
| Buscar por ID  | SELECT * FROM Equipo WHERE Id_Equipo = @0     | SI     |
| Actualizar     | UPDATE Equipo SET ... WHERE Id_Equipo = @0    | NO     |
| Eliminar       | DELETE FROM Equipo WHERE Id_Equipo = @0       | NO     |

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_InsertarEquipo
    @IdCapitan INT,
    @Nombre NVARCHAR(100),
    @Siglas NVARCHAR(10),
    @LogoURL NVARCHAR(MAX) = NULL
AS
BEGIN
    INSERT INTO Equipo (Id_Capitan, Nombre, Siglas, Logo_URL)
    VALUES (@IdCapitan, @Nombre, @Siglas, @LogoURL);
    SELECT SCOPE_IDENTITY() AS Id_Equipo;
END
GO

CREATE OR ALTER PROCEDURE sp_ActualizarEquipo
    @IdEquipo INT,
    @Nombre NVARCHAR(100),
    @Siglas NVARCHAR(10),
    @LogoURL NVARCHAR(MAX) = NULL
AS
BEGIN
    UPDATE Equipo
    SET Nombre = ISNULL(@Nombre, Nombre),
        Siglas = ISNULL(@Siglas, Siglas),
        Logo_URL = ISNULL(@LogoURL, Logo_URL)
    WHERE Id_Equipo = @IdEquipo;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarEquipo
    @IdEquipo INT
AS
BEGIN
    DELETE FROM Equipo WHERE Id_Equipo = @IdEquipo;
END
```

```typescript
// Actualizar en equipo.service.ts
async crear(dto: any) {
    return await this.dataSource.query(
        'EXEC sp_InsertarEquipo @IdCapitan=@0, @Nombre=@1, @Siglas=@2, @LogoURL=@3',
        [dto.Id_Capitan, dto.Nombre, dto.Siglas, dto.Logo_URL ?? null]
    );
}

async actualizar(id: number, dto: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarEquipo @IdEquipo=@0, @Nombre=@1, @Siglas=@2, @LogoURL=@3',
        [id, dto.Nombre, dto.Siglas, dto.Logo_URL]
    );
}

async eliminar(id: number) {
    return await this.dataSource.query(
        'EXEC sp_EliminarEquipo @IdEquipo=@0', [id]
    );
}
```

---

### Equipo_Jugador

| Operacion          | Como esta ahora                          | Con SP |
|--------------------|------------------------------------------|--------|
| Agregar jugador    | INSERT INTO Equipo_Jugador ...           | NO     |
| Listar todos       | SELECT * FROM Equipo_Jugador             | SI     |
| Miembros x equipo  | SELECT con JOIN a Usuario                | SI     |
| Actualizar         | UPDATE Equipo_Jugador SET Id_Equipo ...  | NO     |
| Eliminar           | DELETE FROM Equipo_Jugador WHERE ...     | NO     |

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_AgregarJugadorEquipo
    @IdEquipo INT,
    @IdUsuario INT
AS
BEGIN
    INSERT INTO Equipo_Jugador (Id_Equipo, Id_Usuario) VALUES (@IdEquipo, @IdUsuario);
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarJugadorEquipo
    @IdEquipo INT,
    @IdUsuario INT
AS
BEGIN
    DELETE FROM Equipo_Jugador WHERE Id_Equipo = @IdEquipo AND Id_Usuario = @IdUsuario;
END
```

```typescript
// Actualizar en equipo_jugador.service.ts
async agregarJugador(dto: any) {
    return await this.dataSource.query(
        'EXEC sp_AgregarJugadorEquipo @IdEquipo=@0, @IdUsuario=@1',
        [dto.Id_Equipo, dto.Id_Usuario]
    );
}

async eliminar(idEquipo: number, idUsuario: number) {
    return await this.dataSource.query(
        'EXEC sp_EliminarJugadorEquipo @IdEquipo=@0, @IdUsuario=@1',
        [idEquipo, idUsuario]
    );
}
```

---

### Participante

| Operacion      | Como esta ahora                                | Con SP |
|----------------|------------------------------------------------|--------|
| Crear          | INSERT INTO Participante ...                   | NO     |
| Listar         | SELECT * FROM Participante                     | SI     |
| Buscar por ID  | SELECT * FROM Participante WHERE ...           | SI     |
| Actualizar     | UPDATE Participante SET ...                    | NO     |
| Eliminar       | DELETE FROM Participante WHERE ...             | NO     |

**Falta:**
- Reemplazar INSERT por `sp_InscribirParticipante` (que valida cupo)
- Reemplazar UPDATE por `sp_ActualizarInscripcion`
- Crear SP para eliminar

SP a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_EliminarParticipante
    @IdParticipante INT
AS
BEGIN
    DELETE FROM Participante WHERE Id_Participante = @IdParticipante;
END
```

```typescript
// Actualizar en participante.service.ts
async crear(dto: any) {
    return await this.dataSource.query(
        'EXEC sp_InscribirParticipante @IdTorneo=@0, @IdEquipo=@1, @IdUsuario=@2, @Nombre=@3',
        [dto.Id_Torneo, dto.Id_Equipo ?? null, dto.Id_Usuario ?? null, dto.Nombre_En_Torneo]
    );
}

async actualizar(id: number, dto: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarInscripcion @IdParticipante=@0, @Estado=@1',
        [id, dto.Estado_Inscripcion]
    );
}

async eliminar(id: number) {
    return await this.dataSource.query(
        'EXEC sp_EliminarParticipante @IdParticipante=@0', [id]
    );
}
```

---

### Match

| Operacion      | Como esta ahora                            | Con SP |
|----------------|--------------------------------------------|--------|
| Crear          | INSERT INTO Match ...                      | NO     |
| Listar         | SELECT * FROM Match                        | SI     |
| Buscar por ID  | SELECT * FROM Match WHERE Id_Match = @0    | SI     |
| Buscar x fase  | SELECT * FROM Match WHERE Id_Fase = @0     | SI     |
| Actualizar     | UPDATE Match SET ...                       | NO     |
| Eliminar       | DELETE en cascada manual                   | NO     |

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_ActualizarMatch
    @IdMatch INT,
    @IdArbitro INT = NULL,
    @FechaHora DATETIME = NULL,
    @Ubicacion NVARCHAR(200) = NULL,
    @Estado NVARCHAR(20) = NULL
AS
BEGIN
    UPDATE Match
    SET Id_Arbitro = ISNULL(@IdArbitro, Id_Arbitro),
        Fecha_Hora = ISNULL(@FechaHora, Fecha_Hora),
        Ubicacion = ISNULL(@Ubicacion, Ubicacion),
        Estado = ISNULL(@Estado, Estado)
    WHERE Id_Match = @IdMatch;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarMatch
    @IdMatch INT
AS
BEGIN
    BEGIN TRANSACTION;
    DELETE FROM Match_Set WHERE Id_Match = @IdMatch;
    DELETE FROM Match_Participante WHERE Id_Match = @IdMatch;
    DELETE FROM Match WHERE Id_Match = @IdMatch;
    COMMIT TRANSACTION;
END
```

```typescript
// Actualizar en match.service.ts
async crear(dto: any) {
    return await this.dataSource.query(
        'EXEC sp_InsertarMatch @IdFase=@0, @Ubicacion=@1',
        [dto.Id_Fase, dto.Ubicacion ?? 'Por definir']
    );
}

async actualizar(id: number, dto: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarMatch @IdMatch=@0, @IdArbitro=@1, @FechaHora=@2, @Ubicacion=@3, @Estado=@4',
        [id, dto.Id_Arbitro ?? null, dto.Fecha_Hora ?? null, dto.Ubicacion ?? null, dto.Estado ?? null]
    );
}

async eliminar(id: number) {
    return await this.dataSource.query(
        'EXEC sp_EliminarMatch @IdMatch=@0', [id]
    );
}
```

---

### Match_Participante

| Operacion           | Como esta ahora                          | Con SP |
|---------------------|------------------------------------------|--------|
| Asignar             | INSERT INTO Match_Participante ...       | NO     |
| Buscar x match      | SELECT con JOIN a Participante           | SI     |
| Actualizar          | UPDATE Match_Participante SET ...        | NO     |
| Registrar resultado | No implementado                          | NO     |
| Eliminar            | DELETE FROM Match_Participante WHERE ... | NO     |

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_AsignarParticipanteMatch
    @IdMatch INT,
    @IdParticipante INT,
    @Lado INT
AS
BEGIN
    INSERT INTO Match_Participante (Id_Match, Id_Participante, Lado, Es_Ganador, Score_Final)
    VALUES (@IdMatch, @IdParticipante, @Lado, 0, 0);
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarParticipanteMatch
    @IdMatch INT,
    @IdParticipante INT
AS
BEGIN
    DELETE FROM Match_Participante
    WHERE Id_Match = @IdMatch AND Id_Participante = @IdParticipante;
END
```

```typescript
// Actualizar en match_participante.service.ts
async asignar(dto: any) {
    return await this.dataSource.query(
        'EXEC sp_AsignarParticipanteMatch @IdMatch=@0, @IdParticipante=@1, @Lado=@2',
        [dto.Id_Match, dto.Id_Participante, dto.Lado ?? 1]
    );
}

async registrarResultado(idMatch: number, idP1: number, score1: number, idP2: number, score2: number) {
    return await this.dataSource.query(
        'EXEC sp_RegistrarResultadoMatch @IdMatch=@0, @IdP1=@1, @Score1=@2, @IdP2=@3, @Score2=@4',
        [idMatch, idP1, score1, idP2, score2]
    );
}

async eliminar(idMatch: number, idPart: number) {
    return await this.dataSource.query(
        'EXEC sp_EliminarParticipanteMatch @IdMatch=@0, @IdParticipante=@1',
        [idMatch, idPart]
    );
}
```

---

### Match_Set

| Operacion      | Como esta ahora                         | Con SP |
|----------------|-----------------------------------------|--------|
| Crear          | INSERT INTO Match_Set ...               | NO     |
| Ver x match    | SELECT * FROM Match_Set WHERE ...       | SI     |
| Actualizar     | UPDATE Match_Set SET ...                | NO     |
| Eliminar       | DELETE FROM Match_Set WHERE ...         | NO     |

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_ActualizarSet
    @IdMatch INT,
    @NumeroSet INT,
    @MapaModo NVARCHAR(100) = NULL,
    @PuntajeLado1 INT = NULL,
    @PuntajeLado2 INT = NULL,
    @IdGanadorSet INT = NULL
AS
BEGIN
    UPDATE Match_Set
    SET Mapa_Modo = ISNULL(@MapaModo, Mapa_Modo),
        Puntaje_Lado1 = ISNULL(@PuntajeLado1, Puntaje_Lado1),
        Puntaje_Lado2 = ISNULL(@PuntajeLado2, Puntaje_Lado2),
        Id_Ganador_Set = ISNULL(@IdGanadorSet, Id_Ganador_Set)
    WHERE Id_Match = @IdMatch AND Numero_Set = @NumeroSet;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarSet
    @IdMatch INT,
    @NumeroSet INT
AS
BEGIN
    DELETE FROM Match_Set WHERE Id_Match = @IdMatch AND Numero_Set = @NumeroSet;
END
```

```typescript
// Actualizar en match_set.service.ts
async crear(dto: any) {
    return await this.dataSource.query(
        'EXEC sp_InsertarSet @IdMatch=@0, @Num=@1, @Mapa=@2, @P1=@3, @P2=@4, @Ganador=@5',
        [dto.Id_Match, dto.Numero_Set, dto.Mapa_Modo, dto.Puntaje_Lado1, dto.Puntaje_Lado2, dto.Id_Ganador_Set]
    );
}

async actualizar(idMatch: number, numSet: number, dto: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarSet @IdMatch=@0, @NumeroSet=@1, @MapaModo=@2, @PuntajeLado1=@3, @PuntajeLado2=@4, @IdGanadorSet=@5',
        [idMatch, numSet, dto.Mapa_Modo ?? null, dto.Puntaje_Lado1 ?? null, dto.Puntaje_Lado2 ?? null, dto.Id_Ganador_Set ?? null]
    );
}

async eliminar(idMatch: number, numSet: number) {
    return await this.dataSource.query(
        'EXEC sp_EliminarSet @IdMatch=@0, @NumeroSet=@1', [idMatch, numSet]
    );
}
```

---

### Sancion

| Operacion        | Como esta ahora               | Con SP |
|------------------|-------------------------------|--------|
| Crear            | repo.create() + save()        | NO     |
| Listar todas     | repo.find()                   | SI     |
| Listar x torneo  | repo.find({ where })          | SI     |
| Actualizar       | repo.update()                 | NO     |
| Eliminar         | repo.delete()                 | NO     |

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_ActualizarSancion
    @IdSancion INT,
    @TipoSancion NVARCHAR(30),
    @Motivo NVARCHAR(500)
AS
BEGIN
    UPDATE Sancion
    SET Tipo_Sancion = ISNULL(@TipoSancion, Tipo_Sancion),
        Motivo = ISNULL(@Motivo, Motivo)
    WHERE Id_Sancion = @IdSancion;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarSancion
    @IdSancion INT
AS
BEGIN
    DELETE FROM Sancion WHERE Id_Sancion = @IdSancion;
END
```

```typescript
// Actualizar en sancion.service.ts
async crear(data: any) {
    return await this.dataSource.query(
        'EXEC sp_InsertarSancion @IdTorneo=@0, @IdPart=@1, @Tipo=@2, @Motivo=@3',
        [data.Id_Torneo, data.Id_Participante, data.Tipo_Sancion, data.Motivo]
    );
}

async actualizar(id: number, data: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarSancion @IdSancion=@0, @TipoSancion=@1, @Motivo=@2',
        [id, data.Tipo_Sancion, data.Motivo]
    );
}

async eliminar(id: number) {
    return await this.dataSource.query(
        'EXEC sp_EliminarSancion @IdSancion=@0', [id]
    );
}
```

---

### Categoria

| Operacion      | Como esta ahora                                   | Con SP |
|----------------|---------------------------------------------------|--------|
| Crear          | INSERT INTO Categoria ...                         | NO     |
| Listar         | SELECT * FROM Categoria                           | SI     |
| Buscar por ID  | SELECT * FROM Categoria WHERE Id_Categoria = @0   | SI     |
| Actualizar     | No implementado                                   | NO     |
| Eliminar       | DELETE FROM Categoria WHERE Id_Categoria = @0     | NO     |

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_InsertarCategoria
    @Nombre NVARCHAR(50),
    @Descripcion NVARCHAR(200) = NULL
AS
BEGIN
    INSERT INTO Categoria (Nombre, Descripcion) VALUES (@Nombre, @Descripcion);
    SELECT SCOPE_IDENTITY() AS Id_Categoria;
END
GO

CREATE OR ALTER PROCEDURE sp_ActualizarCategoria
    @IdCategoria INT,
    @Nombre NVARCHAR(50),
    @Descripcion NVARCHAR(200) = NULL
AS
BEGIN
    UPDATE Categoria
    SET Nombre = ISNULL(@Nombre, Nombre),
        Descripcion = ISNULL(@Descripcion, Descripcion)
    WHERE Id_Categoria = @IdCategoria;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarCategoria
    @IdCategoria INT
AS
BEGIN
    DELETE FROM Categoria WHERE Id_Categoria = @IdCategoria;
END
```

```typescript
// Actualizar en categoria.service.ts
async crear(dto: any) {
    return await this.dataSource.query(
        'EXEC sp_InsertarCategoria @Nombre=@0, @Descripcion=@1',
        [dto.Nombre, dto.Descripcion ?? null]
    );
}

async actualizar(id: number, dto: any) {
    return await this.dataSource.query(
        'EXEC sp_ActualizarCategoria @IdCategoria=@0, @Nombre=@1, @Descripcion=@2',
        [id, dto.Nombre, dto.Descripcion ?? null]
    );
}

async eliminar(id: number) {
    return await this.dataSource.query(
        'EXEC sp_EliminarCategoria @IdCategoria=@0', [id]
    );
}
```

---

### Configuracion_Sistema

| Operacion      | Como esta ahora                              | Con SP |
|----------------|----------------------------------------------|--------|
| Crear          | INSERT INTO Configuracion_Sistema ...        | NO     |
| Listar         | SELECT * FROM Configuracion_Sistema          | SI     |
| Buscar por ID  | SELECT * FROM Configuracion_Sistema WHERE ...| SI     |
| Buscar x clave | SELECT * WHERE Clave = @0                    | SI     |
| Actualizar     | UPDATE Configuracion_Sistema SET ...         | NO     |
| Eliminar       | DELETE FROM Configuracion_Sistema WHERE ...  | NO     |

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_InsertarConfiguracion
    @Clave NVARCHAR(50),
    @Valor NVARCHAR(MAX),
    @Descripcion NVARCHAR(255) = NULL
AS
BEGIN
    INSERT INTO Configuracion_Sistema (Clave, Valor, Descripcion)
    VALUES (@Clave, @Valor, @Descripcion);
END
GO

CREATE OR ALTER PROCEDURE sp_ActualizarConfiguracion
    @IdConfig INT,
    @Valor NVARCHAR(MAX),
    @Descripcion NVARCHAR(255) = NULL
AS
BEGIN
    UPDATE Configuracion_Sistema
    SET Valor = @Valor,
        Descripcion = ISNULL(@Descripcion, Descripcion)
    WHERE Id_Config = @IdConfig;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarConfiguracion
    @IdConfig INT
AS
BEGIN
    DELETE FROM Configuracion_Sistema WHERE Id_Config = @IdConfig;
END
```

---

### Notificacion

| Operacion        | Como esta ahora                          | Con SP |
|------------------|------------------------------------------|--------|
| Crear            | repo.create() + save()                   | NO     |
| Listar todas     | repo.find()                              | SI     |
| Listar x usuario | repo.find({ where: { Id_Usuario } })     | SI     |
| Marcar leida     | repo.update(id, { Leido: true })         | NO     |
| Eliminar         | repo.delete(id)                          | NO     |

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_InsertarNotificacion
    @IdUsuario INT,
    @Titulo NVARCHAR(100),
    @Mensaje NVARCHAR(500)
AS
BEGIN
    INSERT INTO Notificacion (Id_Usuario, Titulo, Mensaje, Leido)
    VALUES (@IdUsuario, @Titulo, @Mensaje, 0);
END
GO

CREATE OR ALTER PROCEDURE sp_MarcarNotificacionLeida
    @IdNotificacion BIGINT
AS
BEGIN
    UPDATE Notificacion SET Leido = 1 WHERE Id_Notificacion = @IdNotificacion;
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarNotificacion
    @IdNotificacion BIGINT
AS
BEGIN
    DELETE FROM Notificacion WHERE Id_Notificacion = @IdNotificacion;
END
```

---

### Posiciones

| Operacion             | Como esta ahora                         | Con SP |
|-----------------------|-----------------------------------------|--------|
| Listar todas          | repo.find()                             | SI     |
| Posiciones x torneo   | EXEC sp_ObtenerTablaPosiciones          | SI     |
| Crear / Actualizar    | Gestionado automaticamente por triggers | NO TOCAR |

La tabla Posiciones es escrita exclusivamente por los triggers `trg_AutoCrearPosicion` y `trg_ActualizarTablaPosiciones`. No se debe escribir desde el API.

---

### Auditoria

| Operacion        | Como esta ahora                     | Con SP |
|------------------|-------------------------------------|--------|
| Listar todas     | repo.find()                         | SI     |
| Listar x usuario | repo.find({ where: { Id_Usuario }}) | SI     |

La tabla Auditoria es escrita exclusivamente por los triggers `trg_AuditoriaUsuarios` y `trg_AuditoriaEliminacionTorneo`. No se escribe desde el API.

---

### Rol

| Operacion       | Como esta ahora                     | Con SP |
|-----------------|-------------------------------------|--------|
| Listar          | rolRepo.find()                      | SI     |
| Buscar x nombre | rolRepo.findOneBy({ nombre })       | SI     |
| Actualizar      | rolRepo.update(id, { descripcion }) | NO     |

Los roles son datos maestros fijos del sistema. No se crean ni eliminan desde el API.

---

### Solicitud_Rol

| Operacion      | Como esta ahora                        | Con SP |
|----------------|----------------------------------------|--------|
| Crear          | solicitudRepo.create() + save()        | NO     |
| Ver pendientes | solicitudRepo.find({ Estado })         | SI     |
| Procesar       | Actualiza estado y cambia rol usuario  | NO     |

SPs a crear en la base de datos:
```sql
CREATE OR ALTER PROCEDURE sp_InsertarSolicitudRol
    @IdUsuario INT,
    @RolSolicitado INT,
    @Motivo VARCHAR(500)
AS
BEGIN
    INSERT INTO Solicitud_Rol (Id_Usuario, Rol_Solicitado, Motivo, Estado)
    VALUES (@IdUsuario, @RolSolicitado, @Motivo, 'Pendiente');
END
GO

CREATE OR ALTER PROCEDURE sp_ProcesarSolicitudRol
    @IdSolicitud INT,
    @Estado VARCHAR(20),
    @IdOrganizacion INT = NULL
AS
BEGIN
    BEGIN TRANSACTION;

    DECLARE @IdUsuario INT, @RolSolicitado INT;
    SELECT @IdUsuario = Id_Usuario, @RolSolicitado = Rol_Solicitado
    FROM Solicitud_Rol WHERE Id_Solicitud = @IdSolicitud;

    UPDATE Solicitud_Rol SET Estado = @Estado WHERE Id_Solicitud = @IdSolicitud;

    IF @Estado = 'Aprobado'
    BEGIN
        UPDATE Usuario
        SET Id_Rol = @RolSolicitado,
            Id_Organizacion = ISNULL(@IdOrganizacion, Id_Organizacion)
        WHERE Id_Usuario = @IdUsuario;
    END

    COMMIT TRANSACTION;
END
```

---

## Resumen de SPs que hay que crear en la base de datos

Estos SPs no existen en el script SQL actual y son necesarios para que el proyecto funcione completamente con SPs.

| SP nuevo                   | Tabla               |
|----------------------------|---------------------|
| sp_ActualizarOrganizacion  | Organizacion        |
| sp_ActualizarFase          | Fase                |
| sp_EliminarFase            | Fase                |
| sp_InsertarGrupo           | Grupo (URGENTE - ya se llama pero no existe) |
| sp_ActualizarGrupo         | Grupo               |
| sp_EliminarGrupo           | Grupo               |
| sp_InsertarEquipo          | Equipo              |
| sp_ActualizarEquipo        | Equipo              |
| sp_EliminarEquipo          | Equipo              |
| sp_AgregarJugadorEquipo    | Equipo_Jugador      |
| sp_EliminarJugadorEquipo   | Equipo_Jugador      |
| sp_EliminarParticipante    | Participante        |
| sp_ActualizarMatch         | Match               |
| sp_EliminarMatch           | Match               |
| sp_AsignarParticipanteMatch| Match_Participante  |
| sp_EliminarParticipanteMatch| Match_Participante |
| sp_ActualizarSet           | Match_Set           |
| sp_EliminarSet             | Match_Set           |
| sp_ActualizarSancion       | Sancion             |
| sp_EliminarSancion         | Sancion             |
| sp_InsertarCategoria       | Categoria           |
| sp_ActualizarCategoria     | Categoria           |
| sp_EliminarCategoria       | Categoria           |
| sp_InsertarConfiguracion   | Configuracion_Sistema|
| sp_ActualizarConfiguracion | Configuracion_Sistema|
| sp_EliminarConfiguracion   | Configuracion_Sistema|
| sp_InsertarNotificacion    | Notificacion        |
| sp_MarcarNotificacionLeida | Notificacion        |
| sp_EliminarNotificacion    | Notificacion        |
| sp_InsertarSolicitudRol    | Solicitud_Rol       |
| sp_ProcesarSolicitudRol    | Solicitud_Rol       |

---

## Objetos actuales en la base de datos

| Tipo               | Cantidad |
|--------------------|----------|
| Tablas             | 18       |
| Stored Procedures  | 21       |
| Funciones escalares| 5        |
| Vistas             | 6        |
| Triggers           | 7        |
| Indices            | 4        |