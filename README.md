# MatchControl — Backend

Sistema de gestión de torneos multicategoría. API REST construida con Node.js y Express.js, conectada a una base de datos Microsoft SQL Server con lógica de negocio implementada mediante stored procedures, triggers e índices optimizados.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Ejecución](#ejecución)
- [Base de Datos](#base-de-datos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Seguridad](#seguridad)
- [Concurrencia](#concurrencia)
- [Autoras](#autoras)

---

## Descripción General

MatchControl centraliza la gestión de torneos deportivos, académicos y gamer. El backend expone una API REST que cubre autenticación, gestión de usuarios, torneos, partidas, inscripciones, rankings y auditoría.

Desarrollado como proyecto final del curso **Base de Datos II** en la Universidad Latina de Costa Rica, con énfasis en diseño relacional avanzado, procedimientos almacenados, control de concurrencia y optimización de consultas.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Base de datos | Microsoft SQL Server |
| Autenticación | JWT (JSON Web Tokens) |
| Control de versiones | Git / GitHub |

---

## Arquitectura

```
Frontend — React + Vite
  (github.com/espinoza14sofia-debug/Frontend-matchcontrol)
      |
      | HTTP / REST (http://localhost:3000)
      v
API REST — Node.js + Express.js  <-- este repositorio
  Autenticación · Validación · Controladores
      |
      | SQL / Stored Procedures
      v
Base de Datos — SQL Server
  Tablas · Triggers · Procedures · Funciones · Índices
```

---

## Requisitos Previos

- Node.js
- Microsoft SQL Server + SQL Server Management Studio (SSMS)
- Git

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/espinoza14sofia-debug/Backend-MatchControl.git
cd Backend-MatchControl
```

### 2. Instalar dependencias

```bash
npm install
```

---

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DB_SERVER=localhost
DB_NAME=MatchControl
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_PORT=1433

# Servidor
PORT=3000
NODE_ENV=development

# Seguridad
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=8h
```

---

## Ejecución

```bash
# Modo desarrollo (recarga automática)
npm run dev

# Modo producción
npm start
```

Servidor disponible en: `http://localhost:3000`

---

## Base de Datos

Los scripts están en `Scripts_SQL_organizados_-_Completo.sql` y deben ejecutarse en orden en SSMS.

```sql
-- 1. Crear la base de datos
CREATE DATABASE MatchControl;
USE MatchControl;

-- 2. Ejecutar el script completo en orden:
--    Tablas → Datos iniciales → Stored Procedures → Funciones → Vistas → Triggers → Índices
```

### Componentes incluidos

| Componente | Cantidad | Descripción |
|---|---|---|
| Tablas | 20 | Modelo relacional completo normalizado |
| Stored Procedures | 40+ | CRUD por entidad con manejo de errores |
| Triggers | 8 | Auditoría, validación y automatización |
| Funciones escalares | 5 | Cálculo de puntos, validaciones y utilidades |
| Vistas | 2 | Reportes de resultados y calendario de partidas |
| Índices | 30+ | Optimización de consultas frecuentes |

### Módulos de la base de datos

**Usuarios y seguridad:** `Rol`, `Organizacion`, `Usuario`, `Auditoria`, `Notificacion`, `Solicitud_Rol`

**Clasificación:** `Categoria`, `Disciplina`

**Torneos:** `Torneo`, `Fase`, `Grupo`

**Participantes:** `Participante`, `Equipo`, `Equipo_Jugador`

**Partidas:** `Match`, `Match_Participante`, `Match_Set`

**Ranking y control:** `Posiciones`, `Sancion`, `Configuracion_Sistema`

### Triggers implementados

| Trigger | Tabla | Evento | Función |
|---|---|---|---|
| `trg_AuditoriaUsuarios` | Usuario | AFTER INSERT | Registra nuevos usuarios en auditoría |
| `trg_ControlCambiosScore` | Match_Participante | AFTER UPDATE | Bloquea edición de scores en partidos finalizados |
| `trg_AuditoriaEliminacionTorneo` | Torneo | AFTER DELETE | Rastrea eliminaciones de torneos |
| `trg_AutoCrearPosicion` | Participante | AFTER UPDATE | Crea fila en Posiciones al aceptar inscripción |
| `trg_ValidarReglasSet` | Match_Set | AFTER INSERT/UPDATE | Valida puntajes no negativos e IDs válidos |
| `trg_CalcularPuntosAutomatica` | Match_Participante | AFTER UPDATE | Recalcula puntos al actualizar Score_Final |
| `trg_ActualizarTablaPosiciones` | Match_Participante | AFTER INSERT | Actualiza tabla de posiciones al insertar resultado |

### Conexión con el Frontend

Este backend es consumido por el frontend React/Vite disponible en:

```
https://github.com/espinoza14sofia-debug/Frontend-matchcontrol
```

Asegurarse de que el backend esté corriendo en `http://localhost:3000` antes de levantar el frontend.

---

## Estructura del Proyecto

```
Backend-MatchControl/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   └── config/
├── Scripts_SQL_organizados_-_Completo.sql
├── .env.example
├── package.json
└── README.md
```

> La estructura puede variar. Consulta el contenido del repositorio para detalle exacto.

---

## Seguridad

- Autenticación con JWT
- Contraseñas almacenadas como hash, nunca en texto plano
- Control de acceso por roles: Admin, Organizador, Árbitro, Participante
- Integridad referencial con Foreign Keys y restricciones
- Auditoría automática mediante triggers en tablas críticas
- Validación de datos con CHECK constraints y triggers en la capa de base de datos

---

## Concurrencia

| Escenario | Riesgo | Solución |
|---|---|---|
| Inscripciones simultáneas | Superar límite de cupos | Nivel SERIALIZABLE + bloqueo en validación |
| Registro simultáneo de resultados | Sobreescritura de datos | Validación de estado + bloqueo del registro |
| Aprobación simultánea de inscripciones | Registros duplicados en Posiciones | Índice único + nivel SERIALIZABLE en trigger |
| Eliminación de torneo en uso | Deadlocks e inconsistencia referencial | Soft Delete (Estado = 'Cancelado') |

---

## Autoras

| Nombre | GitHub |
|---|---|
| Sofía Vargas Espinoza | [@espinoza14sofia-debug](https://github.com/espinoza14sofia-debug) |
| Jendry Linneth Murillo Pérez | [@lnnth0440](https://github.com/lnnth0440) |

**Curso:** Base de Datos II  
**Profesor:** David Acuña Mora  
**Universidad:** Universidad Latina de Costa Rica — Sede Santa Cruz  
**Período:** I Cuatrimestre 2026