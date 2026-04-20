 
--  MatchControl

--  Script SQL completo 
 
 
-- Creacion de la Base de datos
CREATE DATABASE MatchControl;

GO

-- Uso de la base de datos
USE MatchControl;

GO


-- ============================================================
-- TABLAS
-- ============================================================

-- Tabla Rol: tipos de usuario del sistema (Admin, Organizador, Arbitro, Participante).
CREATE TABLE Rol (
    Id_Rol      INT IDENTITY(1,1) PRIMARY KEY,
    Nombre      NVARCHAR(50)  NOT NULL UNIQUE,
    Descripcion NVARCHAR(255)
);

-- Tabla Organizacion: entidades que crean y administran torneos.
CREATE TABLE Organizacion (
    Id_Organizacion INT IDENTITY(1,1) PRIMARY KEY,
    Nombre          NVARCHAR(100) NOT NULL UNIQUE,
    Email           NVARCHAR(100),
    Telefono        NVARCHAR(20),
    Estado          BIT DEFAULT 1,
    Fecha_Creacion  DATETIME DEFAULT GETDATE()
);

-- Tabla Usuario: todos los usuarios del sistema con su rol y organizacion.
CREATE TABLE Usuario (
    Id_Usuario      INT IDENTITY(1,1) PRIMARY KEY,
    Id_Rol          INT           NOT NULL,
    Id_Organizacion INT           NULL,
    Nombre_Completo NVARCHAR(150) NOT NULL,
    Nickname        NVARCHAR(50)  UNIQUE,
    Email           NVARCHAR(100) NOT NULL UNIQUE,
    Password_Hash   NVARCHAR(MAX) NOT NULL,
    Estado          BIT DEFAULT 1,
    Fecha_Registro  DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Usuario_Rol FOREIGN KEY (Id_Rol)          REFERENCES Rol(Id_Rol),
    CONSTRAINT FK_Usuario_Org FOREIGN KEY (Id_Organizacion) REFERENCES Organizacion(Id_Organizacion)
);

-- Tabla Categoria: agrupa las disciplinas en categorias generales (Mobile eSports, etc.).
CREATE TABLE Categoria (
    Id_Categoria INT IDENTITY(1,1) PRIMARY KEY,
    Nombre       NVARCHAR(50)  NOT NULL UNIQUE,
    Descripcion  NVARCHAR(200)
);

-- Tabla Disciplina: juego o deporte especifico, con tipo de participacion e integrantes.
CREATE TABLE Disciplina (
    Id_Disciplina      INT IDENTITY(1,1) PRIMARY KEY,
    Id_Categoria       INT NOT NULL,
    Nombre             NVARCHAR(50) NOT NULL,
    Tipo_Participacion NVARCHAR(20) CHECK (Tipo_Participacion IN ('Individual', 'Equipo', 'Ambos')),
    Min_Integrantes    INT DEFAULT 1,
    Max_Integrantes    INT,
    CONSTRAINT FK_Disciplina_Cat FOREIGN KEY (Id_Categoria) REFERENCES Categoria(Id_Categoria)
);

-- Tabla Configuracion_Sistema: parametros globales del sistema (clave-valor).
CREATE TABLE Configuracion_Sistema (
    Id_Config   INT IDENTITY(1,1) PRIMARY KEY,
    Clave       NVARCHAR(50)  NOT NULL UNIQUE,
    Valor       NVARCHAR(MAX),
    Descripcion NVARCHAR(255)
);

-- Tabla Torneo: entidad principal, contiene toda la info de un torneo.
CREATE TABLE Torneo (
    Id_Torneo          INT IDENTITY(1,1) PRIMARY KEY,
    Id_Disciplina      INT           NOT NULL,
    Id_Organizacion    INT           NOT NULL,
    Id_Creador         INT           NOT NULL,
    Nombre             NVARCHAR(150) NOT NULL,
    Estado             NVARCHAR(20)  DEFAULT 'Borrador' CHECK (Estado IN ('Borrador','Inscripciones','En Curso','Finalizado','Cancelado')),
    Formato            NVARCHAR(30)  CHECK (Formato IN ('Eliminacion Directa','Round Robin','Grupos','Suizo')),
    Max_Participantes  INT           NOT NULL,
    Puntos_Victoria    INT DEFAULT 3,
    Puntos_Empate      INT DEFAULT 1,
    Puntos_Derrota     INT DEFAULT 0,
    Es_Publico         BIT DEFAULT 1,
    Requiere_Aprobacion BIT DEFAULT 0,
    Fecha_Inicio       DATETIME,
    Fecha_Fin          DATETIME,
    Fecha_Creacion     DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Torneo_Disc FOREIGN KEY (Id_Disciplina)   REFERENCES Disciplina(Id_Disciplina),
    CONSTRAINT FK_Torneo_Org  FOREIGN KEY (Id_Organizacion) REFERENCES Organizacion(Id_Organizacion),
    CONSTRAINT FK_Torneo_User FOREIGN KEY (Id_Creador)      REFERENCES Usuario(Id_Usuario)
);

-- Tabla Fase: etapas del torneo (grupos, semifinal, final, etc.) ordenadas por numero.
CREATE TABLE Fase (
    Id_Fase   INT IDENTITY(1,1) PRIMARY KEY,
    Id_Torneo INT          NOT NULL,
    Nombre    NVARCHAR(50),
    Orden     INT          NOT NULL,
    Tipo_Fase NVARCHAR(30) CHECK (Tipo_Fase IN ('Grupos','Eliminacion','Round Robin')),
    CONSTRAINT FK_Fase_Torneo FOREIGN KEY (Id_Torneo) REFERENCES Torneo(Id_Torneo)
);

-- Tabla Grupo: subdivide una fase en grupos (Grupo A, B, etc.).
CREATE TABLE Grupo (
    Id_Grupo INT IDENTITY(1,1) PRIMARY KEY,
    Id_Fase  INT NOT NULL,
    Nombre   NVARCHAR(30),
    CONSTRAINT FK_Grupo_Fase FOREIGN KEY (Id_Fase) REFERENCES Fase(Id_Fase)
);

-- Tabla Equipo: equipos inscritos en torneos con su capitan y datos visuales.
CREATE TABLE Equipo (
    Id_Equipo  INT IDENTITY(1,1) PRIMARY KEY,
    Id_Capitan INT           NOT NULL,
    Nombre     NVARCHAR(100) NOT NULL,
    Siglas     NVARCHAR(10),
    Logo_URL   NVARCHAR(MAX),
    CONSTRAINT FK_Equipo_Capitan FOREIGN KEY (Id_Capitan) REFERENCES Usuario(Id_Usuario)
);

-- Tabla Equipo_Jugador: relacion entre jugadores y sus equipos con fecha de union.
CREATE TABLE Equipo_Jugador (
    Id_Equipo  INT NOT NULL,
    Id_Usuario INT NOT NULL,
    Fecha_Union DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (Id_Equipo, Id_Usuario),
    CONSTRAINT FK_EJ_Eq FOREIGN KEY (Id_Equipo)  REFERENCES Equipo(Id_Equipo),
    CONSTRAINT FK_EJ_Us FOREIGN KEY (Id_Usuario) REFERENCES Usuario(Id_Usuario)
);

-- Tabla Participante: quien juega en un torneo, puede ser usuario individual o equipo.
CREATE TABLE Participante (
    Id_Participante    INT IDENTITY(1,1) PRIMARY KEY,
    Id_Torneo          INT           NOT NULL,
    Id_Usuario         INT           NULL,
    Id_Equipo          INT           NULL,
    Nombre_En_Torneo   NVARCHAR(100),
    Estado_Inscripcion NVARCHAR(20)  DEFAULT 'Pendiente' CHECK (Estado_Inscripcion IN ('Pendiente','Aceptado','Rechazado')),
    Fecha_Registro     DATETIME      DEFAULT GETDATE(),
    CONSTRAINT FK_Part_Torneo FOREIGN KEY (Id_Torneo)  REFERENCES Torneo(Id_Torneo),
    CONSTRAINT FK_Part_User   FOREIGN KEY (Id_Usuario) REFERENCES Usuario(Id_Usuario),
    CONSTRAINT FK_Part_Eq     FOREIGN KEY (Id_Equipo)  REFERENCES Equipo(Id_Equipo),
    CONSTRAINT CHK_Unico_Tipo CHECK (
        (Id_Usuario IS NOT NULL AND Id_Equipo IS NULL) OR
        (Id_Usuario IS NULL     AND Id_Equipo IS NOT NULL)
    )
);

-- Tabla Match: partidos programados con fase, grupo, arbitro, fecha y estado.
CREATE TABLE Match (
    Id_Match  INT IDENTITY(1,1) PRIMARY KEY,
    Id_Fase   INT          NOT NULL,
    Id_Grupo  INT          NULL,
    Id_Arbitro INT         NULL,
    Fecha_Hora DATETIME,
    Ubicacion  NVARCHAR(200),
    Estado     NVARCHAR(20) DEFAULT 'Programado' CHECK (Estado IN ('Programado','En Juego','Finalizado','Postpuesto')),
    CONSTRAINT FK_Match_Fase   FOREIGN KEY (Id_Fase)   REFERENCES Fase(Id_Fase),
    CONSTRAINT FK_Match_Grupo  FOREIGN KEY (Id_Grupo)  REFERENCES Grupo(Id_Grupo),
    CONSTRAINT FK_Match_Arbitro FOREIGN KEY (Id_Arbitro) REFERENCES Usuario(Id_Usuario)
);

-- Tabla Match_Participante: resultado de cada participante en un partido (lado, score, ganador).
CREATE TABLE Match_Participante (
    Id_Match        INT NOT NULL,
    Id_Participante INT NOT NULL,
    Lado            INT CHECK (Lado IN (1, 2)),
    Es_Ganador      BIT DEFAULT 0,
    Score_Final     INT DEFAULT 0,
    PRIMARY KEY (Id_Match, Id_Participante),
    CONSTRAINT FK_MP_Match FOREIGN KEY (Id_Match)        REFERENCES Match(Id_Match),
    CONSTRAINT FK_MP_Part  FOREIGN KEY (Id_Participante) REFERENCES Participante(Id_Participante)
);

-- Tabla Match_Set: detalle de cada mapa o ronda interna de un partido.
CREATE TABLE Match_Set (
    Id_Set        INT IDENTITY(1,1) PRIMARY KEY,
    Id_Match      INT          NOT NULL,
    Numero_Set    INT          NOT NULL,
    Mapa_Modo     NVARCHAR(100),
    Puntaje_Lado1 INT DEFAULT 0,
    Puntaje_Lado2 INT DEFAULT 0,
    Id_Ganador_Set INT NULL,
    CONSTRAINT FK_Set_Match FOREIGN KEY (Id_Match) REFERENCES Match(Id_Match)
);

-- Tabla Posiciones: tabla de posiciones por fase y grupo con estadisticas de cada participante.
CREATE TABLE Posiciones (
    Id_Posicion     INT IDENTITY(1,1) PRIMARY KEY,
    Id_Fase         INT NOT NULL,
    Id_Grupo        INT NULL,
    Id_Participante INT NOT NULL,
    Puntos          INT DEFAULT 0,
    PJ              INT DEFAULT 0,
    PG              INT DEFAULT 0,
    PE              INT DEFAULT 0,
    PP              INT DEFAULT 0,
    Score_Favor     INT DEFAULT 0,
    Score_Contra    INT DEFAULT 0,
    CONSTRAINT FK_Pos_Fase FOREIGN KEY (Id_Fase)         REFERENCES Fase(Id_Fase),
    CONSTRAINT FK_Pos_Part FOREIGN KEY (Id_Participante) REFERENCES Participante(Id_Participante)
);

-- Tabla Auditoria: historial de acciones del sistema para trazabilidad y seguridad.
CREATE TABLE Auditoria (
    Id_Auditoria      BIGINT IDENTITY(1,1) PRIMARY KEY,
    Fecha             DATETIME     DEFAULT GETDATE(),
    Id_Usuario        INT          NOT NULL,
    Accion            NVARCHAR(50),
    Tabla             NVARCHAR(50),
    Valores_Anteriores NVARCHAR(MAX),
    Valores_Nuevos    NVARCHAR(MAX),
    IP_Address        NVARCHAR(45),
    CONSTRAINT FK_Audit_User FOREIGN KEY (Id_Usuario) REFERENCES Usuario(Id_Usuario)
);

-- Tabla Sancion: advertencias, suspensiones o descalificaciones aplicadas a participantes.
CREATE TABLE Sancion (
    Id_Sancion      INT IDENTITY(1,1) PRIMARY KEY,
    Id_Torneo       INT NOT NULL,
    Id_Participante INT NOT NULL,
    Tipo_Sancion    NVARCHAR(30) CHECK (Tipo_Sancion IN ('Advertencia','Suspension','Descalificacion')),
    Motivo          NVARCHAR(500),
    Fecha_Sancion   DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Sancion_Torneo FOREIGN KEY (Id_Torneo)       REFERENCES Torneo(Id_Torneo),
    CONSTRAINT FK_Sancion_Part   FOREIGN KEY (Id_Participante) REFERENCES Participante(Id_Participante)
);

-- Tabla Notificacion: mensajes enviados a usuarios sobre eventos del sistema.
CREATE TABLE Notificacion (
    Id_Notificacion BIGINT IDENTITY(1,1) PRIMARY KEY,
    Id_Usuario      INT           NOT NULL,
    Titulo          NVARCHAR(100),
    Mensaje         NVARCHAR(500),
    Leido           BIT DEFAULT 0,
    Fecha_Envio     DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Notif_User FOREIGN KEY (Id_Usuario) REFERENCES Usuario(Id_Usuario)
);

-- Tabla Solicitud_Rol: peticiones de usuarios para cambiar su rol (Organizador o Arbitro).
CREATE TABLE Solicitud_Rol (
    Id_Solicitud   INT IDENTITY(1,1) PRIMARY KEY,
    Id_Usuario     INT          NOT NULL,
    Rol_Solicitado INT          NOT NULL,
    Motivo         VARCHAR(500),
    Estado         VARCHAR(20)  DEFAULT 'Pendiente',
    Fecha_Creacion DATETIME     DEFAULT GETDATE(),
    FOREIGN KEY (Id_Usuario)     REFERENCES Usuario(Id_Usuario),
    FOREIGN KEY (Rol_Solicitado) REFERENCES Rol(Id_Rol)
);
GO


-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Roles base del sistema: Admin, Organizador, Arbitro, Participante.
IF NOT EXISTS (SELECT 1 FROM Rol WHERE Nombre = 'Admin')
BEGIN
    INSERT INTO Rol (Nombre, Descripcion) VALUES
    ('Admin',        'Acceso total al sistema. Permisos de superusuario.'),
    ('Organizador',  'Gestion de torneos, disciplinas y aprobacion de participantes.'),
    ('Arbitro',      'Registro de resultados, gestion de sets y mapas en tiempo real.'),
    ('Participante', 'Perfil para jugadores individuales o capitanes de equipos.');
END
GO


-- ============================================================
-- STORED PROCEDURES
-- ============================================================

-- sp_InsertarUsuario: registra un nuevo usuario validando nickname y email unicos.
CREATE OR ALTER PROCEDURE sp_InsertarUsuario
    @IdRol          INT,
    @NombreCompleto NVARCHAR(150),
    @Nickname       NVARCHAR(50),
    @Email          NVARCHAR(100),
    @PasswordHash   NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Usuario WHERE Nickname = @Nickname)
            THROW 50030, 'El nickname ya esta en uso.', 1;
        IF EXISTS (SELECT 1 FROM Usuario WHERE Email = @Email)
            THROW 50031, 'El email ya esta en uso.', 1;
        INSERT INTO Usuario (Id_Rol, Nombre_Completo, Nickname, Email, Password_Hash, Estado)
        VALUES (@IdRol, @NombreCompleto, @Nickname, @Email, @PasswordHash, 1);
        SELECT SCOPE_IDENTITY() AS Id_Usuario;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerUsuario: consulta usuarios activos; sin parametro trae todos.
CREATE OR ALTER PROCEDURE sp_ObtenerUsuario
    @IdUsuario INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT U.Id_Usuario, U.Nombre_Completo, U.Nickname, U.Email,
               U.Estado, U.Fecha_Registro,
               R.Nombre AS Rol, O.Nombre AS Organizacion
        FROM Usuario U
        INNER JOIN Rol          R ON U.Id_Rol          = R.Id_Rol
        LEFT  JOIN Organizacion O ON U.Id_Organizacion = O.Id_Organizacion
        WHERE (@IdUsuario IS NULL OR U.Id_Usuario = @IdUsuario)
          AND U.Estado = 1
        ORDER BY U.Nombre_Completo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarUsuario: actualiza nombre y email de un usuario existente.
CREATE OR ALTER PROCEDURE sp_ActualizarUsuario
    @IdUsuario      INT,
    @NombreCompleto NVARCHAR(150),
    @Email          NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Usuario
        SET Nombre_Completo = @NombreCompleto, Email = @Email
        WHERE Id_Usuario = @IdUsuario;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarUsuario: desactiva la cuenta (soft delete) sin perder historial.
CREATE OR ALTER PROCEDURE sp_EliminarUsuario
    @IdUsuario INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Usuario SET Estado = 0 WHERE Id_Usuario = @IdUsuario;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InsertarOrganizacion: crea una organizacion validando nombre unico.
CREATE OR ALTER PROCEDURE sp_InsertarOrganizacion
    @Nombre   NVARCHAR(100),
    @Email    NVARCHAR(100) = NULL,
    @Telefono NVARCHAR(20)  = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Organizacion WHERE Nombre = @Nombre)
            THROW 50002, 'Ya existe una organizacion con ese nombre.', 1;
        INSERT INTO Organizacion (Nombre, Email, Telefono, Estado)
        VALUES (@Nombre, @Email, @Telefono, 1);
        SELECT SCOPE_IDENTITY() AS Id_Organizacion;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerOrganizacion: consulta organizaciones activas; sin parametro trae todas.
CREATE OR ALTER PROCEDURE sp_ObtenerOrganizacion
    @IdOrganizacion INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT Id_Organizacion, Nombre, Email, Telefono, Estado, Fecha_Creacion
        FROM Organizacion
        WHERE (@IdOrganizacion IS NULL OR Id_Organizacion = @IdOrganizacion)
          AND Estado = 1
        ORDER BY Nombre;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarOrganizacion: modifica nombre, email y telefono de una organizacion.
CREATE OR ALTER PROCEDURE sp_ActualizarOrganizacion
    @IdOrganizacion INT,
    @Nombre         NVARCHAR(100),
    @Email          NVARCHAR(100),
    @Telefono       NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Organizacion WHERE Id_Organizacion = @IdOrganizacion)
            THROW 50010, 'Organizacion no encontrada.', 1;
        UPDATE Organizacion
        SET Nombre = @Nombre, Email = @Email, Telefono = @Telefono
        WHERE Id_Organizacion = @IdOrganizacion;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarOrganizacion: desactiva la organizacion (soft delete).
CREATE OR ALTER PROCEDURE sp_EliminarOrganizacion
    @IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Organizacion SET Estado = 0 WHERE Id_Organizacion = @IdOrganizacion;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InsertarCategoria: crea una nueva categoria de disciplinas.
CREATE OR ALTER PROCEDURE sp_InsertarCategoria
    @Nombre      NVARCHAR(50),
    @Descripcion NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Categoria (Nombre, Descripcion) VALUES (@Nombre, @Descripcion);
        SELECT SCOPE_IDENTITY() AS Id_Categoria;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerCategoria: consulta categorias; sin parametro trae todas.
CREATE OR ALTER PROCEDURE sp_ObtenerCategoria
    @IdCategoria INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT Id_Categoria, Nombre, Descripcion
        FROM Categoria
        WHERE (@IdCategoria IS NULL OR Id_Categoria = @IdCategoria)
        ORDER BY Nombre;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarCategoria: modifica nombre y descripcion de una categoria.
CREATE OR ALTER PROCEDURE sp_ActualizarCategoria
    @IdCategoria INT,
    @Nombre      NVARCHAR(50),
    @Descripcion NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Categoria
        SET Nombre = ISNULL(@Nombre, Nombre), Descripcion = ISNULL(@Descripcion, Descripcion)
        WHERE Id_Categoria = @IdCategoria;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarCategoria: elimina una categoria si no tiene disciplinas asociadas.
CREATE OR ALTER PROCEDURE sp_EliminarCategoria
    @IdCategoria INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Disciplina WHERE Id_Categoria = @IdCategoria)
            THROW 50020, 'No se puede eliminar: la categoria tiene disciplinas asociadas.', 1;
        DELETE FROM Categoria WHERE Id_Categoria = @IdCategoria;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InsertarDisciplina: registra un juego o deporte con tipo de participacion.
CREATE OR ALTER PROCEDURE sp_InsertarDisciplina
    @IdCategoria INT,
    @Nombre      NVARCHAR(100),
    @Tipo        NVARCHAR(50),
    @Min         INT,
    @Max         INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Disciplina (Id_Categoria, Nombre, Tipo_Participacion, Min_Integrantes, Max_Integrantes)
        VALUES (@IdCategoria, @Nombre, @Tipo, @Min, @Max);
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerDisciplina: consulta disciplinas con su categoria; sin parametro trae todas.
CREATE OR ALTER PROCEDURE sp_ObtenerDisciplina
    @IdDisciplina INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT D.Id_Disciplina, D.Nombre, D.Tipo_Participacion,
               D.Min_Integrantes, D.Max_Integrantes,
               C.Id_Categoria, C.Nombre AS Categoria
        FROM Disciplina D
        INNER JOIN Categoria C ON D.Id_Categoria = C.Id_Categoria
        WHERE (@IdDisciplina IS NULL OR D.Id_Disciplina = @IdDisciplina)
        ORDER BY C.Nombre, D.Nombre;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarDisciplina: modifica nombre y limites de integrantes.
CREATE OR ALTER PROCEDURE sp_ActualizarDisciplina
    @IdDisciplina INT,
    @Nombre       NVARCHAR(50),
    @Min          INT,
    @Max          INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Disciplina
        SET Nombre          = ISNULL(@Nombre, Nombre),
            Min_Integrantes = ISNULL(@Min, Min_Integrantes),
            Max_Integrantes = ISNULL(@Max, Max_Integrantes)
        WHERE Id_Disciplina = @IdDisciplina;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarDisciplina: elimina solo si no tiene torneos asociados.
CREATE OR ALTER PROCEDURE sp_EliminarDisciplina
    @IdDisciplina INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Torneo WHERE Id_Disciplina = @IdDisciplina)
            THROW 50060, 'No se puede eliminar: la disciplina tiene torneos asociados.', 1;
        DELETE FROM Disciplina WHERE Id_Disciplina = @IdDisciplina;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InsertarTorneo: crea un torneo en estado Borrador con validacion de cupo.
CREATE OR ALTER PROCEDURE sp_InsertarTorneo
    @IdDisciplina   INT,
    @IdOrganizacion INT,
    @IdCreador      INT,
    @Nombre         NVARCHAR(100),
    @Formato        NVARCHAR(50),
    @MaxParticipantes INT,
    @FechaInicio    DATETIME = NULL,
    @FechaFin       DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @MaxParticipantes <= 0
            THROW 50001, 'Max participantes debe ser mayor que 0.', 1;
        BEGIN TRANSACTION;
        INSERT INTO Torneo (Id_Disciplina, Id_Organizacion, Id_Creador, Nombre,
                            Estado, Formato, Max_Participantes, Puntos_Victoria,
                            Puntos_Empate, Fecha_Inicio, Fecha_Fin)
        VALUES (@IdDisciplina, @IdOrganizacion, @IdCreador, @Nombre,
                'Borrador', @Formato, @MaxParticipantes, 3, 1, @FechaInicio, @FechaFin);
        SELECT SCOPE_IDENTITY() AS Id_Torneo_Creado;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- sp_ConsultarTorneoDetalle: devuelve un torneo con nombre de disciplina y organizacion.
CREATE OR ALTER PROCEDURE sp_ConsultarTorneoDetalle
    @IdTorneo INT
AS
BEGIN
    SELECT T.*, D.Nombre AS Disciplina, O.Nombre AS Organizacion
    FROM Torneo T
    JOIN Disciplina   D ON T.Id_Disciplina   = D.Id_Disciplina
    JOIN Organizacion O ON T.Id_Organizacion = O.Id_Organizacion
    WHERE T.Id_Torneo = @IdTorneo;
END;
GO

-- sp_ActualizarTorneoEstado: cambia el estado del torneo (Borrador, En Curso, etc.).
CREATE OR ALTER PROCEDURE sp_ActualizarTorneoEstado
    @IdTorneo INT,
    @Estado   NVARCHAR(50)
AS
BEGIN
    BEGIN TRY
        UPDATE Torneo SET Estado = @Estado WHERE Id_Torneo = @IdTorneo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarTorneo: elimina el torneo y toda su informacion en cascada.
CREATE OR ALTER PROCEDURE sp_EliminarTorneo
    @IdTorneo INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        DELETE FROM Match_Set
        WHERE Id_Match IN (SELECT M.Id_Match FROM Match M JOIN Fase F ON M.Id_Fase = F.Id_Fase WHERE F.Id_Torneo = @IdTorneo);
        DELETE FROM Match_Participante
        WHERE Id_Match IN (SELECT M.Id_Match FROM Match M JOIN Fase F ON M.Id_Fase = F.Id_Fase WHERE F.Id_Torneo = @IdTorneo);
        DELETE FROM Match       WHERE Id_Fase  IN (SELECT Id_Fase FROM Fase WHERE Id_Torneo = @IdTorneo);
        DELETE FROM Posiciones  WHERE Id_Fase  IN (SELECT Id_Fase FROM Fase WHERE Id_Torneo = @IdTorneo);
        DELETE FROM Grupo       WHERE Id_Fase  IN (SELECT Id_Fase FROM Fase WHERE Id_Torneo = @IdTorneo);
        DELETE FROM Fase        WHERE Id_Torneo = @IdTorneo;
        DELETE FROM Participante WHERE Id_Torneo = @IdTorneo;
        DELETE FROM Torneo      WHERE Id_Torneo  = @IdTorneo;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- sp_InsertarFase: agrega una etapa al torneo con orden y tipo de fase.
CREATE OR ALTER PROCEDURE sp_InsertarFase
    @IdTorneo   INT,
    @NombreFase NVARCHAR(30),
    @Orden      INT,
    @TipoFase   NVARCHAR(30) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Fase (Id_Torneo, Nombre, Orden, Tipo_Fase)
        VALUES (@IdTorneo, @NombreFase, @Orden, @TipoFase);
        SELECT SCOPE_IDENTITY() AS Id_Fase;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerFase: consulta fases con su torneo; filtra por torneo o fase especifica.
CREATE OR ALTER PROCEDURE sp_ObtenerFase
    @IdTorneo INT = NULL,
    @IdFase   INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT F.Id_Fase, F.Id_Torneo, F.Nombre, F.Orden, F.Tipo_Fase, T.Nombre AS Torneo
        FROM Fase F
        INNER JOIN Torneo T ON F.Id_Torneo = T.Id_Torneo
        WHERE (@IdTorneo IS NULL OR F.Id_Torneo = @IdTorneo)
          AND (@IdFase   IS NULL OR F.Id_Fase   = @IdFase)
        ORDER BY F.Id_Torneo, F.Orden;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarFase: modifica nombre, orden y tipo de una fase existente.
CREATE OR ALTER PROCEDURE sp_ActualizarFase
    @IdFase   INT,
    @Nombre   NVARCHAR(50),
    @Orden    INT,
    @TipoFase NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Fase
        SET Nombre    = ISNULL(@Nombre, Nombre),
            Orden     = ISNULL(@Orden, Orden),
            Tipo_Fase = ISNULL(@TipoFase, Tipo_Fase)
        WHERE Id_Fase = @IdFase;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarFase: elimina una fase con todos sus grupos, matches y posiciones.
CREATE OR ALTER PROCEDURE sp_EliminarFase
    @IdFase INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        DELETE FROM Posiciones       WHERE Id_Fase = @IdFase;
        DELETE FROM Grupo            WHERE Id_Fase = @IdFase;
        DELETE FROM Match_Set        WHERE Id_Match IN (SELECT Id_Match FROM Match WHERE Id_Fase = @IdFase);
        DELETE FROM Match_Participante WHERE Id_Match IN (SELECT Id_Match FROM Match WHERE Id_Fase = @IdFase);
        DELETE FROM Match            WHERE Id_Fase = @IdFase;
        DELETE FROM Fase             WHERE Id_Fase = @IdFase;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- sp_InsertarGrupo: crea un grupo dentro de una fase.
CREATE OR ALTER PROCEDURE sp_InsertarGrupo
    @IdFase      INT,
    @NombreGrupo NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Grupo (Id_Fase, Nombre) VALUES (@IdFase, @NombreGrupo);
        SELECT SCOPE_IDENTITY() AS Id_Grupo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerGrupo: consulta grupos con su fase; filtra por fase o grupo especifico.
CREATE OR ALTER PROCEDURE sp_ObtenerGrupo
    @IdFase  INT = NULL,
    @IdGrupo INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT G.Id_Grupo, G.Id_Fase, G.Nombre, F.Nombre AS Fase, F.Id_Torneo
        FROM Grupo G
        INNER JOIN Fase F ON G.Id_Fase = F.Id_Fase
        WHERE (@IdFase  IS NULL OR G.Id_Fase  = @IdFase)
          AND (@IdGrupo IS NULL OR G.Id_Grupo = @IdGrupo)
        ORDER BY G.Id_Fase, G.Nombre;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarGrupo: modifica el nombre o la fase de un grupo.
CREATE OR ALTER PROCEDURE sp_ActualizarGrupo
    @IdGrupo INT,
    @Nombre  NVARCHAR(30),
    @IdFase  INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Grupo
        SET Nombre  = ISNULL(@Nombre, Nombre),
            Id_Fase = ISNULL(@IdFase, Id_Fase)
        WHERE Id_Grupo = @IdGrupo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarGrupo: elimina un grupo de una fase.
CREATE OR ALTER PROCEDURE sp_EliminarGrupo
    @IdGrupo INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Grupo WHERE Id_Grupo = @IdGrupo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InsertarEquipo: crea un equipo con capitan, siglas y logo opcional.
CREATE OR ALTER PROCEDURE sp_InsertarEquipo
    @IdCapitan INT,
    @Nombre    NVARCHAR(100),
    @Siglas    NVARCHAR(10),
    @LogoURL   NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Equipo (Id_Capitan, Nombre, Siglas, Logo_URL)
        VALUES (@IdCapitan, @Nombre, @Siglas, @LogoURL);
        SELECT SCOPE_IDENTITY() AS Id_Equipo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerEquipo: consulta equipos con nombre del capitan; sin parametro trae todos.
CREATE OR ALTER PROCEDURE sp_ObtenerEquipo
    @IdEquipo INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT E.Id_Equipo, E.Nombre, E.Siglas, E.Logo_URL, E.Id_Capitan,
               U.Nombre_Completo AS Capitan, U.Nickname AS Nickname_Capitan
        FROM Equipo E
        INNER JOIN Usuario U ON E.Id_Capitan = U.Id_Usuario
        WHERE (@IdEquipo IS NULL OR E.Id_Equipo = @IdEquipo)
        ORDER BY E.Nombre;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarEquipo: modifica nombre, siglas y logo de un equipo.
CREATE OR ALTER PROCEDURE sp_ActualizarEquipo
    @IdEquipo INT,
    @Nombre   NVARCHAR(100),
    @Siglas   NVARCHAR(10),
    @LogoURL  NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Equipo
        SET Nombre   = ISNULL(@Nombre, Nombre),
            Siglas   = ISNULL(@Siglas, Siglas),
            Logo_URL = ISNULL(@LogoURL, Logo_URL)
        WHERE Id_Equipo = @IdEquipo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarEquipo: elimina un equipo del sistema.
CREATE OR ALTER PROCEDURE sp_EliminarEquipo
    @IdEquipo INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Equipo WHERE Id_Equipo = @IdEquipo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_AgregarJugadorEquipo: agrega un jugador a un equipo validando que no este ya inscrito.
CREATE OR ALTER PROCEDURE sp_AgregarJugadorEquipo
    @IdEquipo  INT,
    @IdUsuario INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Equipo_Jugador WHERE Id_Equipo = @IdEquipo AND Id_Usuario = @IdUsuario)
            THROW 50040, 'El jugador ya pertenece a este equipo.', 1;
        INSERT INTO Equipo_Jugador (Id_Equipo, Id_Usuario) VALUES (@IdEquipo, @IdUsuario);
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerJugadoresEquipo: lista los jugadores de un equipo indicando quien es capitan.
CREATE OR ALTER PROCEDURE sp_ObtenerJugadoresEquipo
    @IdEquipo INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Equipo WHERE Id_Equipo = @IdEquipo)
            THROW 50070, 'El equipo no existe.', 1;
        SELECT EJ.Id_Equipo, EJ.Id_Usuario, EJ.Fecha_Union,
               U.Nombre_Completo, U.Nickname, U.Email,
               CASE WHEN E.Id_Capitan = EJ.Id_Usuario THEN 1 ELSE 0 END AS Es_Capitan
        FROM Equipo_Jugador EJ
        INNER JOIN Usuario U ON EJ.Id_Usuario = U.Id_Usuario
        INNER JOIN Equipo  E ON EJ.Id_Equipo  = E.Id_Equipo
        WHERE EJ.Id_Equipo = @IdEquipo
        ORDER BY Es_Capitan DESC, U.Nombre_Completo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarJugadorEquipo: cambia el capitan de un equipo por otro jugador del mismo equipo.
CREATE OR ALTER PROCEDURE sp_ActualizarJugadorEquipo
    @IdEquipo       INT,
    @IdNuevoCapitan INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Equipo_Jugador WHERE Id_Equipo = @IdEquipo AND Id_Usuario = @IdNuevoCapitan)
            THROW 50071, 'El nuevo capitan no pertenece al equipo.', 1;
        UPDATE Equipo SET Id_Capitan = @IdNuevoCapitan WHERE Id_Equipo = @IdEquipo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarJugadorEquipo: remueve un jugador de un equipo.
CREATE OR ALTER PROCEDURE sp_EliminarJugadorEquipo
    @IdEquipo  INT,
    @IdUsuario INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Equipo_Jugador WHERE Id_Equipo = @IdEquipo AND Id_Usuario = @IdUsuario;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InscribirParticipante: inscribe un usuario o equipo en un torneo.
CREATE OR ALTER PROCEDURE sp_InscribirParticipante
    @IdTorneo  INT,
    @IdUsuario INT = NULL,
    @IdEquipo  INT = NULL,
    @Nombre    NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Participante (Id_Torneo, Id_Usuario, Id_Equipo, Nombre_En_Torneo)
        VALUES (@IdTorneo, @IdUsuario, @IdEquipo, @Nombre);
        SELECT SCOPE_IDENTITY() AS Id_Participante;
    END TRY
    BEGIN CATCH
        THROW 50000, 'Error al inscribir: verifique que sea solo Usuario o Equipo y que el torneo exista.', 1;
    END CATCH
END;
GO

-- sp_ObtenerParticipante: consulta participantes de un torneo o uno especifico.
CREATE OR ALTER PROCEDURE sp_ObtenerParticipante
    @IdTorneo       INT = NULL,
    @IdParticipante INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT P.Id_Participante, P.Id_Torneo, P.Nombre_En_Torneo,
               P.Estado_Inscripcion, P.Fecha_Registro,
               T.Nombre AS Torneo,
               U.Id_Usuario, U.Nickname AS Jugador,
               E.Id_Equipo, E.Nombre AS Equipo, E.Siglas
        FROM Participante P
        INNER JOIN Torneo  T ON P.Id_Torneo  = T.Id_Torneo
        LEFT  JOIN Usuario U ON P.Id_Usuario = U.Id_Usuario
        LEFT  JOIN Equipo  E ON P.Id_Equipo  = E.Id_Equipo
        WHERE (@IdTorneo       IS NULL OR P.Id_Torneo       = @IdTorneo)
          AND (@IdParticipante IS NULL OR P.Id_Participante = @IdParticipante)
        ORDER BY P.Estado_Inscripcion, P.Nombre_En_Torneo;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarInscripcion: aprueba o rechaza la inscripcion de un participante.
CREATE OR ALTER PROCEDURE sp_ActualizarInscripcion
    @IdParticipante INT,
    @Estado         NVARCHAR(50)
AS
BEGIN
    UPDATE Participante SET Estado_Inscripcion = @Estado WHERE Id_Participante = @IdParticipante;
END;
GO

-- sp_EliminarParticipante: elimina un participante del torneo.
CREATE OR ALTER PROCEDURE sp_EliminarParticipante
    @IdParticipante INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Participante WHERE Id_Participante = @IdParticipante;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InsertarMatch: crea un partido en una fase con estado Programado.
CREATE OR ALTER PROCEDURE sp_InsertarMatch
    @IdFase    INT,
    @Ubicacion NVARCHAR(100)
AS
BEGIN
    INSERT INTO Match (Id_Fase, Estado, Fecha_Hora, Ubicacion)
    VALUES (@IdFase, 'Programado', GETDATE(), @Ubicacion);
END;
GO

-- sp_ObtenerMatch: consulta partidos con arbitro, fase, grupo y torneo; filtra por fase o match.
CREATE OR ALTER PROCEDURE sp_ObtenerMatch
    @IdFase  INT = NULL,
    @IdMatch INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT M.Id_Match, M.Id_Fase, M.Id_Grupo, M.Fecha_Hora,
               M.Ubicacion, M.Estado, M.Id_Arbitro,
               U.Nombre_Completo AS Arbitro,
               F.Nombre AS Fase, G.Nombre AS Grupo,
               T.Id_Torneo, T.Nombre AS Torneo
        FROM Match M
        INNER JOIN Fase   F ON M.Id_Fase   = F.Id_Fase
        INNER JOIN Torneo T ON F.Id_Torneo = T.Id_Torneo
        LEFT  JOIN Grupo  G ON M.Id_Grupo  = G.Id_Grupo
        LEFT  JOIN Usuario U ON M.Id_Arbitro = U.Id_Usuario
        WHERE (@IdFase  IS NULL OR M.Id_Fase  = @IdFase)
          AND (@IdMatch IS NULL OR M.Id_Match = @IdMatch)
        ORDER BY M.Fecha_Hora;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarMatch: modifica arbitro, fecha, ubicacion y estado de un partido.
CREATE OR ALTER PROCEDURE sp_ActualizarMatch
    @IdMatch   INT,
    @IdArbitro INT           = NULL,
    @FechaHora DATETIME      = NULL,
    @Ubicacion NVARCHAR(200) = NULL,
    @Estado    NVARCHAR(20)  = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Match
        SET Id_Arbitro = ISNULL(@IdArbitro, Id_Arbitro),
            Fecha_Hora = ISNULL(@FechaHora, Fecha_Hora),
            Ubicacion  = ISNULL(@Ubicacion, Ubicacion),
            Estado     = ISNULL(@Estado, Estado)
        WHERE Id_Match = @IdMatch;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarMatch: elimina un partido con sus sets y participantes asociados.
CREATE OR ALTER PROCEDURE sp_EliminarMatch
    @IdMatch INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        DELETE FROM Match_Set          WHERE Id_Match = @IdMatch;
        DELETE FROM Match_Participante WHERE Id_Match = @IdMatch;
        DELETE FROM Match              WHERE Id_Match = @IdMatch;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- sp_RegistrarResultadoMatch: actualiza scores de ambos lados y cierra el match.
CREATE OR ALTER PROCEDURE sp_RegistrarResultadoMatch
    @IdMatch INT, @IdP1 INT, @Score1 INT, @IdP2 INT, @Score2 INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        UPDATE Match_Participante SET Score_Final = @Score1 WHERE Id_Match = @IdMatch AND Id_Participante = @IdP1;
        UPDATE Match_Participante SET Score_Final = @Score2 WHERE Id_Match = @IdMatch AND Id_Participante = @IdP2;
        UPDATE Match SET Estado = 'Finalizado' WHERE Id_Match = @IdMatch;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- sp_AsignarParticipanteMatch: asigna un participante a un lado del partido.
CREATE OR ALTER PROCEDURE sp_AsignarParticipanteMatch
    @IdMatch        INT,
    @IdParticipante INT,
    @Lado           INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Match_Participante (Id_Match, Id_Participante, Lado, Es_Ganador, Score_Final)
        VALUES (@IdMatch, @IdParticipante, @Lado, 0, 0);
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerParticipantesMatch: lista los dos lados de un partido con sus resultados.
CREATE OR ALTER PROCEDURE sp_ObtenerParticipantesMatch
    @IdMatch INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT MP.Id_Match, MP.Id_Participante, MP.Lado, MP.Es_Ganador, MP.Score_Final,
               P.Nombre_En_Torneo, U.Nickname AS Jugador, E.Nombre AS Equipo
        FROM Match_Participante MP
        INNER JOIN Participante P ON MP.Id_Participante = P.Id_Participante
        LEFT  JOIN Usuario      U ON P.Id_Usuario       = U.Id_Usuario
        LEFT  JOIN Equipo       E ON P.Id_Equipo        = E.Id_Equipo
        WHERE MP.Id_Match = @IdMatch
        ORDER BY MP.Lado;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarParticipanteMatch: actualiza score y resultado de un lado del partido.
CREATE OR ALTER PROCEDURE sp_ActualizarParticipanteMatch
    @IdMatch        INT,
    @IdParticipante INT,
    @ScoreFinal     INT,
    @EsGanador      BIT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Match_Participante WHERE Id_Match = @IdMatch AND Id_Participante = @IdParticipante)
            THROW 50080, 'El participante no esta registrado en este match.', 1;
        UPDATE Match_Participante
        SET Score_Final = @ScoreFinal, Es_Ganador = @EsGanador
        WHERE Id_Match = @IdMatch AND Id_Participante = @IdParticipante;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarParticipanteMatch: remueve un participante de un partido especifico.
CREATE OR ALTER PROCEDURE sp_EliminarParticipanteMatch
    @IdMatch        INT,
    @IdParticipante INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Match_Participante WHERE Id_Match = @IdMatch AND Id_Participante = @IdParticipante;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InsertarSet: registra el detalle de un mapa o ronda dentro de un partido.
CREATE OR ALTER PROCEDURE sp_InsertarSet
    @IdMatch INT, @Num INT, @Mapa NVARCHAR(100), @P1 INT, @P2 INT, @Ganador INT
AS
BEGIN
    INSERT INTO Match_Set (Id_Match, Numero_Set, Mapa_Modo, Puntaje_Lado1, Puntaje_Lado2, Id_Ganador_Set)
    VALUES (@IdMatch, @Num, @Mapa, @P1, @P2, @Ganador);
END;
GO

-- sp_ObtenerSets: lista los sets de un partido ordenados por numero de set.
CREATE OR ALTER PROCEDURE sp_ObtenerSets
    @IdMatch INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT MS.Id_Set, MS.Id_Match, MS.Numero_Set, MS.Mapa_Modo,
               MS.Puntaje_Lado1, MS.Puntaje_Lado2, MS.Id_Ganador_Set,
               P.Nombre_En_Torneo AS Ganador_Nombre
        FROM Match_Set MS
        LEFT JOIN Participante P ON MS.Id_Ganador_Set = P.Id_Participante
        WHERE MS.Id_Match = @IdMatch
        ORDER BY MS.Numero_Set;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarSet: modifica mapa, puntajes y ganador de un set especifico.
CREATE OR ALTER PROCEDURE sp_ActualizarSet
    @IdMatch      INT,
    @NumeroSet    INT,
    @MapaModo     NVARCHAR(100) = NULL,
    @PuntajeLado1 INT           = NULL,
    @PuntajeLado2 INT           = NULL,
    @IdGanadorSet INT           = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Match_Set
        SET Mapa_Modo      = ISNULL(@MapaModo, Mapa_Modo),
            Puntaje_Lado1  = ISNULL(@PuntajeLado1, Puntaje_Lado1),
            Puntaje_Lado2  = ISNULL(@PuntajeLado2, Puntaje_Lado2),
            Id_Ganador_Set = ISNULL(@IdGanadorSet, Id_Ganador_Set)
        WHERE Id_Match = @IdMatch AND Numero_Set = @NumeroSet;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarSet: elimina un set especifico de un partido.
CREATE OR ALTER PROCEDURE sp_EliminarSet
    @IdMatch   INT,
    @NumeroSet INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Match_Set WHERE Id_Match = @IdMatch AND Numero_Set = @NumeroSet;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ConsultarPosiciones: tabla de posiciones de un torneo ordenada por puntos y diferencia.
CREATE OR ALTER PROCEDURE sp_ConsultarPosiciones
    @IdTorneo INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Torneo WHERE Id_Torneo = @IdTorneo)
        BEGIN PRINT 'El ID de Torneo no existe.'; RETURN; END
        SELECT POS.Id_Posicion, POS.Id_Participante, POS.Puntos,
               POS.PJ, POS.PG, POS.PE, POS.PP,
               POS.Score_Favor, POS.Score_Contra,
               (POS.Score_Favor - POS.Score_Contra) AS Diferencia_Score,
               F.Nombre AS Nombre_Fase
        FROM Posiciones POS
        INNER JOIN Fase F ON POS.Id_Fase = F.Id_Fase
        WHERE F.Id_Torneo = @IdTorneo
        ORDER BY POS.Puntos DESC, (POS.Score_Favor - POS.Score_Contra) DESC;
    END TRY
    BEGIN CATCH
        DECLARE @Err NVARCHAR(4000) = 'Error en Posiciones: ' + ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END;
GO

-- sp_ObtenerTablaPosiciones: tabla de posiciones con nombre del participante resuelto.
CREATE OR ALTER PROCEDURE sp_ObtenerTablaPosiciones
    @Id_Torneo INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.Id_Posicion,
           ISNULL(u.Nombre_Completo, 'Participante ' + CAST(p.Id_Participante AS VARCHAR)) AS Participante,
           p.Puntos, p.PJ AS Partidos_Jugados, p.PG AS Ganados,
           p.PE AS Empatados, p.PP AS Perdidos,
           p.Score_Favor, p.Score_Contra,
           (p.Score_Favor - p.Score_Contra) AS Diferencia_Score
    FROM Posiciones p
    LEFT JOIN Participante part ON p.Id_Participante = part.Id_Participante
    LEFT JOIN Usuario      u    ON part.Id_Usuario   = u.Id_Usuario
    ORDER BY p.Puntos DESC, (p.Score_Favor - p.Score_Contra) DESC;
END;
GO

-- sp_InsertarSancion: registra una sancion (advertencia, suspension, descalificacion).
CREATE OR ALTER PROCEDURE sp_InsertarSancion
    @IdTorneo INT, @IdPart INT, @Tipo NVARCHAR(50), @Motivo NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Sancion (Id_Torneo, Id_Participante, Tipo_Sancion, Motivo, Fecha_Sancion)
    VALUES (@IdTorneo, @IdPart, @Tipo, @Motivo, GETDATE());
END;
GO

-- sp_ObtenerSancion: consulta sanciones por torneo o por ID; sin parametros trae todas.
CREATE OR ALTER PROCEDURE sp_ObtenerSancion
    @IdTorneo  INT = NULL,
    @IdSancion INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT S.Id_Sancion, S.Id_Torneo, S.Id_Participante,
               S.Tipo_Sancion, S.Motivo, S.Fecha_Sancion,
               T.Nombre AS Torneo, P.Nombre_En_Torneo AS Participante, U.Nickname
        FROM Sancion S
        INNER JOIN Torneo       T ON S.Id_Torneo      = T.Id_Torneo
        INNER JOIN Participante P ON S.Id_Participante = P.Id_Participante
        LEFT  JOIN Usuario      U ON P.Id_Usuario      = U.Id_Usuario
        WHERE (@IdTorneo  IS NULL OR S.Id_Torneo  = @IdTorneo)
          AND (@IdSancion IS NULL OR S.Id_Sancion = @IdSancion)
        ORDER BY S.Fecha_Sancion DESC;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarSancion: modifica el tipo y motivo de una sancion existente.
CREATE OR ALTER PROCEDURE sp_ActualizarSancion
    @IdSancion   INT,
    @TipoSancion NVARCHAR(30),
    @Motivo      NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Sancion
        SET Tipo_Sancion = ISNULL(@TipoSancion, Tipo_Sancion),
            Motivo       = ISNULL(@Motivo, Motivo)
        WHERE Id_Sancion = @IdSancion;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarSancion: elimina una sancion del sistema.
CREATE OR ALTER PROCEDURE sp_EliminarSancion
    @IdSancion INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Sancion WHERE Id_Sancion = @IdSancion;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InsertarConfiguracion: agrega un parametro de configuracion al sistema.
CREATE OR ALTER PROCEDURE sp_InsertarConfiguracion
    @Clave       NVARCHAR(50),
    @Valor       NVARCHAR(MAX),
    @Descripcion NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Configuracion_Sistema (Clave, Valor, Descripcion)
        VALUES (@Clave, @Valor, @Descripcion);
        SELECT SCOPE_IDENTITY() AS Id_Config;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerConfiguracion: consulta configuraciones por clave o ID; sin parametros trae todas.
CREATE OR ALTER PROCEDURE sp_ObtenerConfiguracion
    @Clave    NVARCHAR(50) = NULL,
    @IdConfig INT          = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT Id_Config, Clave, Valor, Descripcion
        FROM Configuracion_Sistema
        WHERE (@Clave    IS NULL OR Clave     = @Clave)
          AND (@IdConfig IS NULL OR Id_Config = @IdConfig)
        ORDER BY Clave;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ActualizarConfiguracion: modifica el valor y descripcion de una configuracion.
CREATE OR ALTER PROCEDURE sp_ActualizarConfiguracion
    @IdConfig    INT,
    @Valor       NVARCHAR(MAX),
    @Descripcion NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Configuracion_Sistema
        SET Valor = @Valor, Descripcion = ISNULL(@Descripcion, Descripcion)
        WHERE Id_Config = @IdConfig;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarConfiguracion: elimina un parametro de configuracion del sistema.
CREATE OR ALTER PROCEDURE sp_EliminarConfiguracion
    @IdConfig INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Configuracion_Sistema WHERE Id_Config = @IdConfig;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InsertarNotificacion: crea una notificacion para un usuario del sistema.
CREATE OR ALTER PROCEDURE sp_InsertarNotificacion
    @IdUsuario INT,
    @Titulo    NVARCHAR(100),
    @Mensaje   NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Notificacion (Id_Usuario, Titulo, Mensaje, Leido)
        VALUES (@IdUsuario, @Titulo, @Mensaje, 0);
        SELECT SCOPE_IDENTITY() AS Id_Notificacion;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerNotificaciones: lista notificaciones de un usuario; puede filtrar solo no leidas.
CREATE OR ALTER PROCEDURE sp_ObtenerNotificaciones
    @IdUsuario    INT,
    @SoloNoLeidas BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT Id_Notificacion, Id_Usuario, Titulo, Mensaje, Leido, Fecha_Envio
        FROM Notificacion
        WHERE Id_Usuario = @IdUsuario
          AND (@SoloNoLeidas = 0 OR Leido = 0)
        ORDER BY Fecha_Envio DESC;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_MarcarNotificacionLeida: marca una notificacion como leida.
CREATE OR ALTER PROCEDURE sp_MarcarNotificacionLeida
    @IdNotificacion BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        UPDATE Notificacion SET Leido = 1 WHERE Id_Notificacion = @IdNotificacion;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_EliminarNotificacion: elimina una notificacion del sistema.
CREATE OR ALTER PROCEDURE sp_EliminarNotificacion
    @IdNotificacion BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM Notificacion WHERE Id_Notificacion = @IdNotificacion;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_InsertarSolicitudRol: crea una solicitud para cambiar el rol de un usuario.
CREATE OR ALTER PROCEDURE sp_InsertarSolicitudRol
    @IdUsuario     INT,
    @RolSolicitado INT,
    @Motivo        VARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Solicitud_Rol (Id_Usuario, Rol_Solicitado, Motivo, Estado)
        VALUES (@IdUsuario, @RolSolicitado, @Motivo, 'Pendiente');
        SELECT SCOPE_IDENTITY() AS Id_Solicitud;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ObtenerSolicitudesRol: lista solicitudes de rol; filtra por usuario o estado.
CREATE OR ALTER PROCEDURE sp_ObtenerSolicitudesRol
    @IdUsuario INT         = NULL,
    @Estado    VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT SR.Id_Solicitud, SR.Id_Usuario, SR.Rol_Solicitado,
               SR.Motivo, SR.Estado, SR.Fecha_Creacion,
               U.Nickname, U.Email, R.Nombre AS Rol_Nombre
        FROM Solicitud_Rol SR
        INNER JOIN Usuario U ON SR.Id_Usuario     = U.Id_Usuario
        INNER JOIN Rol     R ON SR.Rol_Solicitado = R.Id_Rol
        WHERE (@IdUsuario IS NULL OR SR.Id_Usuario = @IdUsuario)
          AND (@Estado    IS NULL OR SR.Estado     = @Estado)
        ORDER BY SR.Fecha_Creacion DESC;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO

-- sp_ProcesarSolicitudRol: aprueba o rechaza una solicitud y actualiza el rol del usuario.
CREATE OR ALTER PROCEDURE sp_ProcesarSolicitudRol
    @IdSolicitud    INT,
    @Estado         VARCHAR(20),
    @IdOrganizacion INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        DECLARE @IdUsuario INT, @RolSolicitado INT;
        SELECT @IdUsuario = Id_Usuario, @RolSolicitado = Rol_Solicitado
        FROM Solicitud_Rol WHERE Id_Solicitud = @IdSolicitud;
        IF @IdUsuario IS NULL
            THROW 50050, 'Solicitud no encontrada.', 1;
        UPDATE Solicitud_Rol SET Estado = @Estado WHERE Id_Solicitud = @IdSolicitud;
        IF @Estado = 'Aprobado'
        BEGIN
            UPDATE Usuario
            SET Id_Rol = @RolSolicitado, Id_Organizacion = ISNULL(@IdOrganizacion, Id_Organizacion)
            WHERE Id_Usuario = @IdUsuario;
        END
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- sp_EliminarSolicitudRol: elimina una solicitud solo si esta en estado Pendiente.
CREATE OR ALTER PROCEDURE sp_EliminarSolicitudRol
    @IdSolicitud INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Solicitud_Rol WHERE Id_Solicitud = @IdSolicitud)
            THROW 50090, 'La solicitud no existe.', 1;
        IF EXISTS (SELECT 1 FROM Solicitud_Rol WHERE Id_Solicitud = @IdSolicitud AND Estado <> 'Pendiente')
            THROW 50091, 'Solo se pueden eliminar solicitudes en estado Pendiente.', 1;
        DELETE FROM Solicitud_Rol WHERE Id_Solicitud = @IdSolicitud;
    END TRY
    BEGIN CATCH THROW; END CATCH
END;
GO


-- ============================================================
-- FUNCIONES
-- ============================================================

-- fn_ObtenerPuntosTotales: calcula puntos totales de un participante segun victorias y empates.
CREATE FUNCTION fn_ObtenerPuntosTotales (@Ganados INT, @Empatados INT, @PtsWin INT, @PtsDraw INT)
RETURNS INT
AS
BEGIN
    RETURN (@Ganados * @PtsWin) + (@Empatados * @PtsDraw);
END;
GO

-- fn_ValidarCupoTorneo: devuelve 1 si el torneo aun tiene espacio, 0 si esta lleno.
CREATE FUNCTION fn_ValidarCupoTorneo (@IdTorneo INT)
RETURNS BIT
AS
BEGIN
    DECLARE @Max INT, @Actual INT, @Resultado BIT;
    SELECT @Max    = Max_Participantes FROM Torneo      WHERE Id_Torneo = @IdTorneo;
    SELECT @Actual = COUNT(*)          FROM Participante WHERE Id_Torneo = @IdTorneo;
    IF @Actual < @Max SET @Resultado = 1; ELSE SET @Resultado = 0;
    RETURN @Resultado;
END;
GO

-- fn_GetNombreParticipante: devuelve el nombre en torneo de un participante por ID.
CREATE FUNCTION fn_GetNombreParticipante (@IdParticipante INT)
RETURNS NVARCHAR(150)
AS
BEGIN
    DECLARE @Nombre NVARCHAR(150);
    SELECT @Nombre = Nombre_En_Torneo FROM Participante WHERE Id_Participante = @IdParticipante;
    RETURN ISNULL(@Nombre, 'No Registrado');
END;
GO

-- fn_CalcularDiferenciaScore: resta score en contra del score a favor.
CREATE FUNCTION fn_CalcularDiferenciaScore (@Favor INT, @Contra INT)
RETURNS INT
AS
BEGIN
    RETURN @Favor - @Contra;
END;
GO

-- fn_EstadoTorneoColor: devuelve un color segun el estado del torneo para el frontend.
CREATE FUNCTION fn_EstadoTorneoColor (@Estado NVARCHAR(50))
RETURNS NVARCHAR(20)
AS
BEGIN
    RETURN CASE
        WHEN @Estado = 'Abierto'     THEN 'Verde'
        WHEN @Estado = 'En Curso'    THEN 'Azul'
        WHEN @Estado = 'Finalizado'  THEN 'Gris'
        ELSE 'Rojo'
    END;
END;
GO


-- ============================================================
-- VISTAS
-- ============================================================

-- vw_ReporteGeneralResultados: historial completo de partidos con scores y ganadores.
CREATE VIEW vw_ReporteGeneralResultados AS
SELECT T.Nombre AS Torneo, M.Id_Match, M.Fecha_Hora,
       P.Nombre_En_Torneo AS Participante, MP.Score_Final, MP.Es_Ganador
FROM Match M
JOIN Fase              F  ON M.Id_Fase        = F.Id_Fase
JOIN Torneo            T  ON F.Id_Torneo      = T.Id_Torneo
JOIN Match_Participante MP ON M.Id_Match      = MP.Id_Match
JOIN Participante      P  ON MP.Id_Participante = P.Id_Participante;
GO

-- vw_InscripcionesPendientes: participantes que aun no han sido aprobados o rechazados.
CREATE OR ALTER VIEW vw_InscripcionesPendientes AS
SELECT P.Id_Participante, T.Nombre AS Torneo,
       P.Nombre_En_Torneo, P.Estado_Inscripcion, U.Email AS Contacto_Responsable
FROM Participante P
JOIN Torneo  T ON P.Id_Torneo  = T.Id_Torneo
LEFT JOIN Usuario U ON P.Id_Usuario = U.Id_Usuario
WHERE P.Estado_Inscripcion = 'Pendiente';
GO

-- vw_EstadisticasEquipos: resumen de torneos jugados y victorias totales por equipo.
CREATE OR ALTER VIEW vw_EstadisticasEquipos AS
SELECT E.Nombre AS Equipo, E.Siglas,
       COUNT(DISTINCT P.Id_Participante) AS Torneos_Jugados,
       SUM(POS.PG) AS Total_Victorias
FROM Equipo      E
JOIN Participante P   ON E.Id_Equipo      = P.Id_Equipo
JOIN Posiciones   POS ON P.Id_Participante = POS.Id_Participante
GROUP BY E.Nombre, E.Siglas;
GO

-- vw_CalendarioProximosMatches: partidos en estado Programado con torneo y fase.
CREATE VIEW vw_CalendarioProximosMatches AS
SELECT M.Fecha_Hora, M.Ubicacion, T.Nombre AS Torneo, F.Nombre AS Fase
FROM Match M
JOIN Fase   F ON M.Id_Fase   = F.Id_Fase
JOIN Torneo T ON F.Id_Torneo = T.Id_Torneo
WHERE M.Estado = 'Programado';
GO

-- vw_LogsAuditoriaReciente: ultimas 100 acciones registradas en la auditoria del sistema.
CREATE OR ALTER VIEW vw_LogsAuditoriaReciente AS
SELECT TOP 100
    Id_Auditoria, Fecha, Id_Usuario, Accion,
    Tabla, Valores_Anteriores, Valores_Nuevos, IP_Address
FROM Auditoria
ORDER BY Fecha DESC;
GO

-- vw_UsuariosDetallados: usuarios con nombre de rol, organizacion y estado de cuenta legible.
CREATE OR ALTER VIEW vw_UsuariosDetallados AS
SELECT U.Id_Usuario, U.Nombre_Completo, U.Nickname, U.Email,
       R.Nombre AS Nombre_Rol, O.Nombre AS Nombre_Organizacion,
       CASE WHEN U.Estado = 1 THEN 'Activo' ELSE 'Inactivo' END AS Estado_Cuenta,
       U.Fecha_Registro
FROM Usuario U
LEFT JOIN Rol          R ON U.Id_Rol          = R.Id_Rol
LEFT JOIN Organizacion O ON U.Id_Organizacion = O.Id_Organizacion;
GO


-- ============================================================
-- TRIGGERS
-- ============================================================

-- trg_AuditoriaUsuarios: registra en Auditoria cada nuevo usuario insertado.
CREATE OR ALTER TRIGGER trg_AuditoriaUsuarios ON Usuario AFTER INSERT AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Auditoria (Fecha, Id_Usuario, Accion, Tabla, Valores_Anteriores, Valores_Nuevos, IP_Address)
    SELECT GETDATE(), i.Id_Usuario, 'INSERT', 'Usuario', 'N/A',
           'Nickname: ' + i.Nickname + ' | RolID: ' + CAST(i.Id_Rol AS VARCHAR), '127.0.0.1'
    FROM inserted i;
END;
GO

-- trg_ControlCambiosScore: bloquea edicion de scores en partidos ya finalizados.
CREATE OR ALTER TRIGGER trg_ControlCambiosScore ON Match_Participante AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Match M JOIN inserted i ON M.Id_Match = i.Id_Match WHERE M.Estado = 'Finalizado')
    BEGIN
        RAISERROR('No se pueden editar scores de un Match ya finalizado.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- trg_AuditoriaEliminacionTorneo: deja rastro en Auditoria cuando se elimina un torneo.
CREATE OR ALTER TRIGGER trg_AuditoriaEliminacionTorneo ON Torneo AFTER DELETE AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Auditoria (Fecha, Id_Usuario, Accion, Tabla, Valores_Anteriores, Valores_Nuevos, IP_Address)
    SELECT GETDATE(), NULL, 'DELETE', 'Torneo',
           'Nombre: ' + d.Nombre + ' | Formato: ' + d.Formato, 'REGISTRO ELIMINADO', '127.0.0.1'
    FROM deleted d;
END;
GO

-- trg_AutoCrearPosicion: cuando se acepta un participante, crea su fila en Posiciones automaticamente.
CREATE OR ALTER TRIGGER trg_AutoCrearPosicion ON Participante AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(Estado_Inscripcion)
    BEGIN
        INSERT INTO Posiciones (Id_Fase, Id_Grupo, Id_Participante, Puntos, PJ, PG, PE, PP, Score_Favor, Score_Contra)
        SELECT (SELECT TOP 1 Id_Fase FROM Fase WHERE Id_Torneo = i.Id_Torneo),
               NULL, i.Id_Participante, 0, 0, 0, 0, 0, 0, 0
        FROM inserted i
        WHERE i.Estado_Inscripcion = 'Aceptado'
          AND NOT EXISTS (SELECT 1 FROM Posiciones WHERE Id_Participante = i.Id_Participante);
    END
END;
GO

-- trg_ValidarReglasSet: rechaza puntajes negativos e IDs de ganador invalidos en los sets.
CREATE OR ALTER TRIGGER trg_ValidarReglasSet ON Match_Set AFTER INSERT, UPDATE AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE Puntaje_Lado1 < 0 OR Puntaje_Lado2 < 0)
    BEGIN
        RAISERROR('Los puntajes del set no pueden ser negativos.', 16, 1);
        ROLLBACK TRANSACTION; RETURN;
    END
    IF EXISTS (SELECT 1 FROM inserted WHERE Id_Ganador_Set < 0)
    BEGIN
        RAISERROR('El ID del ganador no es valido.', 16, 1);
        ROLLBACK TRANSACTION; RETURN;
    END
END;
GO

-- trg_CalcularPuntosAutomatica: actualiza Posiciones cuando se modifica el Score_Final de un partido.
CREATE OR ALTER TRIGGER trg_CalcularPuntosAutomatica ON Match_Participante AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(Score_Final)
    BEGIN
        UPDATE POS
        SET POS.PJ          = POS.PJ + 1,
            POS.Score_Favor = POS.Score_Favor + i.Score_Final,
            POS.Score_Contra= POS.Score_Contra + (SELECT Score_Final FROM Match_Participante WHERE Id_Match = i.Id_Match AND Id_Participante <> i.Id_Participante),
            POS.Puntos      = POS.Puntos + (CASE WHEN i.Es_Ganador = 1 THEN 3
                              WHEN EXISTS (SELECT 1 FROM Match_Participante WHERE Id_Match = i.Id_Match AND Score_Final = i.Score_Final AND Id_Participante <> i.Id_Participante) THEN 1
                              ELSE 0 END),
            POS.PG          = POS.PG + (CASE WHEN i.Es_Ganador = 1 THEN 1 ELSE 0 END),
            POS.PP          = POS.PP + (CASE WHEN i.Es_Ganador = 0 AND NOT EXISTS (SELECT 1 FROM Match_Participante WHERE Id_Match = i.Id_Match AND Score_Final = i.Score_Final AND Id_Participante <> i.Id_Participante) THEN 1 ELSE 0 END),
            POS.PE          = POS.PE + (CASE WHEN EXISTS (SELECT 1 FROM Match_Participante WHERE Id_Match = i.Id_Match AND Score_Final = i.Score_Final AND Id_Participante <> i.Id_Participante) THEN 1 ELSE 0 END)
        FROM Posiciones POS
        INNER JOIN inserted i ON POS.Id_Participante = i.Id_Participante;
    END
END;
GO

-- trg_ActualizarTablaPosiciones: actualiza Posiciones al insertar resultados de un partido.
CREATE OR ALTER TRIGGER trg_ActualizarTablaPosiciones ON Match_Participante AFTER INSERT AS
BEGIN
    SET NOCOUNT ON;
    UPDATE P
    SET P.PJ          = P.PJ + 1,
        P.Puntos      = P.Puntos + (CASE WHEN i.Es_Ganador = 1 THEN 3
                        WHEN i.Es_Ganador = 0 AND i.Score_Final = ISNULL(rival.Score_Final, 0) THEN 1
                        ELSE 0 END),
        P.PG          = P.PG + (CASE WHEN i.Es_Ganador = 1 THEN 1 ELSE 0 END),
        P.PE          = P.PE + (CASE WHEN i.Es_Ganador = 0 AND i.Score_Final = ISNULL(rival.Score_Final, 0) THEN 1 ELSE 0 END),
        P.PP          = P.PP + (CASE WHEN i.Es_Ganador = 0 AND i.Score_Final < ISNULL(rival.Score_Final, 0) THEN 1 ELSE 0 END),
        P.Score_Favor = P.Score_Favor + i.Score_Final,
        P.Score_Contra= P.Score_Contra + ISNULL(rival.Score_Final, 0)
    FROM Posiciones P
    INNER JOIN inserted i ON P.Id_Participante = i.Id_Participante
    LEFT  JOIN Match_Participante rival ON i.Id_Match = rival.Id_Match AND rival.Id_Participante <> i.Id_Participante;
END;
GO


-- ============================================================
-- INDICES
-- ============================================================

-- Auditoria: busquedas por usuario y fecha para trazabilidad.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Auditoria_Fecha'        AND object_id = OBJECT_ID('Auditoria'))
    CREATE NONCLUSTERED INDEX IX_Auditoria_Fecha        ON Auditoria (Id_Usuario, Accion, Tabla, Fecha);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Auditoria_Usuario_Fecha' AND object_id = OBJECT_ID('Auditoria'))
    CREATE NONCLUSTERED INDEX IX_Auditoria_Usuario_Fecha ON Auditoria (Accion, Tabla, Id_Usuario, Fecha);
GO

-- Disciplina: filtros y JOINs por categoria.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Disciplina_Categoria' AND object_id = OBJECT_ID('Disciplina'))
    CREATE NONCLUSTERED INDEX IX_Disciplina_Categoria ON Disciplina (Nombre, Tipo_Participacion, Min_Integrantes, Max_Integrantes, Id_Categoria);
GO

-- Equipo: JOINs por capitan.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Equipo_Capitan' AND object_id = OBJECT_ID('Equipo'))
    CREATE NONCLUSTERED INDEX IX_Equipo_Capitan ON Equipo (Nombre, Siglas, Logo_URL, Id_Capitan);
GO

-- Equipo_Jugador: busquedas bidireccionales equipo<->usuario.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_EquipoJugador_Equipo'  AND object_id = OBJECT_ID('Equipo_Jugador'))
    CREATE NONCLUSTERED INDEX IX_EquipoJugador_Equipo  ON Equipo_Jugador (Id_Usuario, Fecha_Union, Id_Equipo);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_EquipoJugador_Usuario' AND object_id = OBJECT_ID('Equipo_Jugador'))
    CREATE NONCLUSTERED INDEX IX_EquipoJugador_Usuario ON Equipo_Jugador (Id_Equipo, Fecha_Union, Id_Usuario);
GO

-- Fase: JOINs por torneo y ordenamiento por Orden.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Fase_Torneo_Orden' AND object_id = OBJECT_ID('Fase'))
    CREATE NONCLUSTERED INDEX IX_Fase_Torneo_Orden ON Fase (Nombre, Tipo_Fase, Id_Torneo, Orden);
GO

-- Grupo: JOINs por fase.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Grupo_Fase' AND object_id = OBJECT_ID('Grupo'))
    CREATE NONCLUSTERED INDEX IX_Grupo_Fase ON Grupo (Nombre, Id_Fase);
GO

-- Match: filtros por fase, grupo, estado, arbitro y fecha.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Match_Arbitro'       AND object_id = OBJECT_ID('Match'))
    CREATE NONCLUSTERED INDEX IX_Match_Arbitro       ON Match (Id_Fase, Estado, Fecha_Hora, Id_Arbitro);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Match_Estado'        AND object_id = OBJECT_ID('Match'))
    CREATE NONCLUSTERED INDEX IX_Match_Estado        ON Match (Id_Fase, Id_Grupo, Fecha_Hora, Ubicacion, Estado);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Match_Fase'          AND object_id = OBJECT_ID('Match'))
    CREATE NONCLUSTERED INDEX IX_Match_Fase          ON Match (Id_Fase);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Match_FechaHora_Estado' AND object_id = OBJECT_ID('Match'))
    CREATE NONCLUSTERED INDEX IX_Match_FechaHora_Estado ON Match (Id_Fase, Id_Grupo, Ubicacion, Fecha_Hora, Estado);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Match_Grupo'         AND object_id = OBJECT_ID('Match'))
    CREATE NONCLUSTERED INDEX IX_Match_Grupo         ON Match (Id_Fase, Estado, Fecha_Hora, Ubicacion, Id_Grupo);
GO

-- Match_Participante: JOINs y filtros por match y participante en ambos sentidos.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_MatchPart_Match_Lado'   AND object_id = OBJECT_ID('Match_Participante'))
    CREATE NONCLUSTERED INDEX IX_MatchPart_Match_Lado   ON Match_Participante (Id_Participante, Es_Ganador, Score_Final, Id_Match, Lado);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_MatchPart_Participante' AND object_id = OBJECT_ID('Match_Participante'))
    CREATE NONCLUSTERED INDEX IX_MatchPart_Participante ON Match_Participante (Id_Match, Lado, Es_Ganador, Score_Final, Id_Participante);
GO

-- Match_Set: JOINs por match y ordenamiento por numero de set.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_MatchSet_Match'       AND object_id = OBJECT_ID('Match_Set'))
    CREATE NONCLUSTERED INDEX IX_MatchSet_Match       ON Match_Set (Id_Match);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_MatchSet_Match_NumSet' AND object_id = OBJECT_ID('Match_Set'))
    CREATE NONCLUSTERED INDEX IX_MatchSet_Match_NumSet ON Match_Set (Mapa_Modo, Puntaje_Lado1, Puntaje_Lado2, Id_Ganador_Set, Id_Match, Numero_Set);
GO

-- Notificacion: filtros por usuario, leido y fecha.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Notif_User_Leido'   AND object_id = OBJECT_ID('Notificacion'))
    CREATE NONCLUSTERED INDEX IX_Notif_User_Leido   ON Notificacion (Id_Usuario, Leido);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Notif_Usuario_Fecha' AND object_id = OBJECT_ID('Notificacion'))
    CREATE NONCLUSTERED INDEX IX_Notif_Usuario_Fecha ON Notificacion (Titulo, Mensaje, Leido, Id_Usuario, Fecha_Envio);
GO

-- Organizacion: filtros por estado.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Organizacion_Estado' AND object_id = OBJECT_ID('Organizacion'))
    CREATE NONCLUSTERED INDEX IX_Organizacion_Estado ON Organizacion (Nombre, Email, Telefono, Estado);
GO

-- Participante: filtros por torneo, usuario, equipo y estado de inscripcion.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Participante_Equipo'       AND object_id = OBJECT_ID('Participante'))
    CREATE NONCLUSTERED INDEX IX_Participante_Equipo       ON Participante (Id_Torneo, Nombre_En_Torneo, Estado_Inscripcion, Id_Equipo);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Participante_Estado'       AND object_id = OBJECT_ID('Participante'))
    CREATE NONCLUSTERED INDEX IX_Participante_Estado       ON Participante (Id_Torneo, Id_Usuario, Id_Equipo, Nombre_En_Torneo, Estado_Inscripcion);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Participante_Torneo'       AND object_id = OBJECT_ID('Participante'))
    CREATE NONCLUSTERED INDEX IX_Participante_Torneo       ON Participante (Id_Torneo);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Participante_Torneo_Estado' AND object_id = OBJECT_ID('Participante'))
    CREATE NONCLUSTERED INDEX IX_Participante_Torneo_Estado ON Participante (Id_Usuario, Id_Equipo, Nombre_En_Torneo, Id_Torneo, Estado_Inscripcion);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Participante_Usuario'      AND object_id = OBJECT_ID('Participante'))
    CREATE NONCLUSTERED INDEX IX_Participante_Usuario      ON Participante (Id_Torneo, Nombre_En_Torneo, Estado_Inscripcion, Id_Usuario);
GO

-- Posiciones: filtros por fase y ordenamiento por puntos para la tabla de posiciones.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Posiciones_Fase'        AND object_id = OBJECT_ID('Posiciones'))
    CREATE NONCLUSTERED INDEX IX_Posiciones_Fase        ON Posiciones (Id_Participante, Puntos, PJ, PG, PE, PP, Score_Favor, Score_Contra, Id_Fase);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Posiciones_Fase_Puntos' AND object_id = OBJECT_ID('Posiciones'))
    CREATE NONCLUSTERED INDEX IX_Posiciones_Fase_Puntos ON Posiciones (Id_Grupo, Id_Participante, Score_Favor, Score_Contra, Id_Fase, Puntos);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Posiciones_Participante' AND object_id = OBJECT_ID('Posiciones'))
    CREATE NONCLUSTERED INDEX IX_Posiciones_Participante ON Posiciones (Id_Fase, Puntos, PG, Id_Participante);
GO

-- Sancion: filtros por torneo y participante.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Sancion_Participante' AND object_id = OBJECT_ID('Sancion'))
    CREATE NONCLUSTERED INDEX IX_Sancion_Participante ON Sancion (Id_Torneo, Tipo_Sancion, Motivo, Fecha_Sancion, Id_Participante);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Sancion_Torneo'       AND object_id = OBJECT_ID('Sancion'))
    CREATE NONCLUSTERED INDEX IX_Sancion_Torneo       ON Sancion (Id_Participante, Tipo_Sancion, Fecha_Sancion, Id_Torneo);
GO

-- Solicitud_Rol: filtros por usuario y estado de la solicitud.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_SolicitudRol_Estado'  AND object_id = OBJECT_ID('Solicitud_Rol'))
    CREATE NONCLUSTERED INDEX IX_SolicitudRol_Estado  ON Solicitud_Rol (Id_Usuario, Rol_Solicitado, Fecha_Creacion, Estado);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_SolicitudRol_Usuario' AND object_id = OBJECT_ID('Solicitud_Rol'))
    CREATE NONCLUSTERED INDEX IX_SolicitudRol_Usuario ON Solicitud_Rol (Rol_Solicitado, Estado, Fecha_Creacion, Id_Usuario);
GO

-- Torneo: filtros por estado, disciplina, organizacion, creador y fecha de inicio.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Torneo_Creador'      AND object_id = OBJECT_ID('Torneo'))
    CREATE NONCLUSTERED INDEX IX_Torneo_Creador      ON Torneo (Nombre, Estado, Id_Creador);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Torneo_Disciplina'   AND object_id = OBJECT_ID('Torneo'))
    CREATE NONCLUSTERED INDEX IX_Torneo_Disciplina   ON Torneo (Nombre, Estado, Formato, Fecha_Inicio, Id_Disciplina);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Torneo_Estado'       AND object_id = OBJECT_ID('Torneo'))
    CREATE NONCLUSTERED INDEX IX_Torneo_Estado       ON Torneo (Nombre, Id_Disciplina, Id_Organizacion, Formato, Max_Participantes, Fecha_Inicio, Estado);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Torneo_FechaInicio'  AND object_id = OBJECT_ID('Torneo'))
    CREATE NONCLUSTERED INDEX IX_Torneo_FechaInicio  ON Torneo (Nombre, Estado, Id_Organizacion, Fecha_Inicio);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Torneo_Organizacion' AND object_id = OBJECT_ID('Torneo'))
    CREATE NONCLUSTERED INDEX IX_Torneo_Organizacion ON Torneo (Nombre, Estado, Fecha_Inicio, Fecha_Fin, Id_Organizacion);
GO

-- Usuario: JOINs por rol y organizacion; los UQ de Email y Nickname ya existen en el CREATE TABLE.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Usuario_Organizacion' AND object_id = OBJECT_ID('Usuario'))
    CREATE NONCLUSTERED INDEX IX_Usuario_Organizacion ON Usuario (Nombre_Completo, Nickname, Estado, Id_Organizacion);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Usuario_Rol'          AND object_id = OBJECT_ID('Usuario'))
    CREATE NONCLUSTERED INDEX IX_Usuario_Rol          ON Usuario (Nombre_Completo, Nickname, Email, Estado, Id_Rol);
GO