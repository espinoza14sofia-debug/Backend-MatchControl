# MatchControl 
### *Controla cada partida, domina el torneo.*

Sistema Web de Gestión de Torneos Multicategoría desarrollado con Node.js, SQL Server y Power BI.

---

##  Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Scripts SQL](#scripts-sql)
- [Dashboard Power BI](#dashboard-power-bi)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Seguridad y Control de Acceso](#seguridad-y-control-de-acceso)
- [Manejo de Concurrencia](#manejo-de-concurrencia)
- [Autoras](#autoras)

---

##  Descripción General

**MatchControl** es una plataforma web que centraliza y automatiza la gestión de torneos deportivos, académicos y gamer. El sistema permite a organizadores, árbitros y participantes interactuar en un entorno seguro, estructurado y con trazabilidad completa de todas las acciones.

Fue desarrollado como proyecto final del curso **Base de Datos II** en la Universidad Latina de Costa Rica, aplicando conceptos avanzados de diseño de bases de datos, normalización, procedimientos almacenados, triggers, concurrencia y optimización de consultas.

### Problema que resuelve

| Problema actual | Solución con MatchControl |
|---|---|
| Inscripciones duplicadas | Validación automática por trigger y constraint UNIQUE |
| Falta de control de cupos | Procedimiento con nivel SERIALIZABLE + bloqueo |
| Resultados poco confiables | Triggers de auditoría y control de cambios |
| Información desorganizada | Modelo relacional normalizado con 20 tablas |
| Sin historial de acciones | Tabla de Auditoría con registro automático |

---

## Tecnologías Utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript, Bootstrap |
| Backend | Node.js + Express.js |
| Base de Datos | Microsoft SQL Server |
| Business Intelligence | Power BI |
| Control de Versiones | Git / GitHub |
| Diagramado | draw.io |

---

## 🏗 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                    │
│              HTML5 + CSS3 + JavaScript + Bootstrap        │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────┐
│                    API REST (Backend)                     │
│                   Node.js + Express.js                    │
│         Autenticación · Validación · Controladores        │
└──────────────────────────┬──────────────────────────────┘
                           │ SQL Queries / Stored Procedures
┌──────────────────────────▼──────────────────────────────┐
│               Base de Datos (SQL Server)                  │
│   Tablas · Triggers · Procedures · Funciones · Índices    │
└──────────────────────────┬──────────────────────────────┘
                           │ DirectQuery / Import
┌──────────────────────────▼──────────────────────────────┐
│                       Power BI                            │
│          Dashboards · KPIs · Reportes · Métricas          │
└─────────────────────────────────────────────────────────┘
```

---

## Estructura de la Base de Datos

El modelo contiene **20 tablas** organizadas en los siguientes módulos:

### Módulo de Usuarios y Seguridad
- `Rol` — Tipos de usuario del sistema (Admin, Organizador, Árbitro, Participante)
- `Organizacion` — Entidades que crean y administran torneos
- `Usuario` — Todos los usuarios registrados con su rol y organización
- `Auditoria` — Registro automático de todas las acciones del sistema
- `Notificacion` — Mensajes y alertas por usuario
- `Solicitud_Rol` — Flujo de solicitud y aprobación de cambios de rol

### Módulo de Clasificación
- `Categoria` — Categorías generales (eSports, Deportivo, Académico, etc.)
- `Disciplina` — Juego o deporte específico con tipo de participación

### Módulo de Torneos
- `Torneo` — Entidad principal del sistema
- `Fase` — Etapas del torneo (grupos, semifinal, final)
- `Grupo` — Subdivisiones dentro de una fase

### Módulo de Participantes
- `Participante` — Quién compite en cada torneo (individual o equipo)
- `Equipo` — Equipos registrados con su capitán
- `Equipo_Jugador` — Relación entre jugadores y sus equipos

### Módulo de Partidas
- `Match` — Enfrentamientos con fecha, ubicación y árbitro
- `Match_Participante` — Resultados por lado de cada partido
- `Match_Set` — Sets o rondas individuales de cada partido

### Módulo de Ranking y Control
- `Posiciones` — Tabla de posiciones actualizada automáticamente
- `Sancion` — Sanciones aplicadas a participantes
- `Configuracion_Sistema` — Parámetros globales (clave-valor)

---

##  Instalación y Configuración

### Requisitos previos

- Node.js 
- SQL Server Management Studio 22
- Power BI Desktop (para visualizar el dashboard)
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/espinoza14sofia-debug/Backend-MatchControl.git

cd Backend-MatchControl
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

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

##  Ejecución del Proyecto

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

---

##  Scripts SQL

Los scripts están organizados en el archivo `Scripts_SQL_organizados_-_Completo.sql` y deben ejecutarse **en orden** en SQL Server Management Studio (SSMS).

### Orden de ejecución

```sql
-- 1. Crear la base de datos
CREATE DATABASE MatchControl;
USE MatchControl;

-- 2. Ejecutar el script completo (incluye en orden):
--    · Creación de tablas (20 tablas)
--    · Datos iniciales (roles, configuración)
--    · Stored Procedures (CRUD completo por entidad)
--    · Funciones escalares (5 funciones)
--    · Vistas (2 vistas de reporte)
--    · Triggers (8 triggers)
--    · Índices optimizados (30+ índices)
```

### Componentes incluidos en el script

| Componente | Cantidad | Descripción |
|---|---|---|
| Tablas | 20 | Modelo relacional completo |
| Stored Procedures | 40+ | CRUD completo por entidad con manejo de errores |
| Triggers | 8 | Auditoría, validación y automatización |
| Funciones escalares | 5 | Cálculo de puntos, validaciones y utilidades |
| Vistas | 2 | Reportes de resultados y calendario de matches |
| Índices | 30+ | Optimización de consultas frecuentes |

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

---

## Dashboard Power BI

El archivo `Dashboard_Power_BI.pbix` contiene el dashboard de análisis del sistema.

### Para abrirlo:

1. Instalar [Power BI Desktop](https://powerbi.microsoft.com/desktop/)
2. Abrir el archivo `Dashboard_Power_BI.pbix`
3. Actualizar la conexión a la base de datos:
   - Ir a **Inicio → Transformar datos → Configuración de origen de datos**
   - Actualizar servidor y credenciales de SQL Server
4. Hacer clic en **Actualizar** para cargar los datos

---

##  Funcionalidades Principales

- **Gestión de usuarios y roles** — Registro, autenticación y control de acceso por rol
- **Creación de torneos** — Con formatos: Eliminación Directa, Round Robin, Grupos, Suizo
- **Inscripciones automatizadas** — Con validación de cupos y aprobación opcional
- **Gestión de partidas** — Programación, asignación de árbitros y registro de resultados
- **Rankings automáticos** — Tabla de posiciones actualizada en tiempo real por triggers
- **Estadísticas y reportes** — Vistas SQL y visualizaciones en Power BI
- **Sistema de sanciones** — Registro de faltas y sanciones por participante
- **Auditoría completa** — Registro automático de todas las acciones del sistema
- **Notificaciones** — Alertas y mensajes por usuario

---

##  Seguridad y Control de Acceso

- **Autenticación** con JWT (JSON Web Tokens)
- **Contraseñas** almacenadas como hash (nunca en texto plano)
- **Control de acceso por roles**: Admin, Organizador, Árbitro, Participante
- **Integridad referencial** garantizada por Foreign Keys con restricciones
- **Auditoría automática** mediante triggers en tablas críticas
- **Validación de datos** en capa de base de datos (CHECK constraints, triggers)

---

##  Manejo de Concurrencia

El sistema contempla 4 escenarios críticos de concurrencia:

| Escenario | Riesgo | Solución |
|---|---|---|
| Inscripciones simultáneas | Superar límite de cupos | Nivel SERIALIZABLE + bloqueo en validación |
| Registro simultáneo de resultados | Sobreescritura de datos | Validación de estado + bloqueo del registro |
| Aprobación simultánea de inscripciones | Registros duplicados en Posiciones | Índice único + nivel SERIALIZABLE en trigger |
| Eliminación de torneo en uso | Deadlocks e inconsistencia referencial | Soft Delete (Estado = 'Cancelado') |

---

##  Autoras

| Nombre | GitHub |
|---|---|
| Sofía Vargas Espinoza | [@espinoza14sofia-debug](https://github.com/espinoza14sofia-debug) |
| Jendry Linneth Murillo Pérez | [@lnnth0440]  (https://github.com/lnnth0440)

**Curso:** Base de Datos II  
**Profesor:** David Acuña Mora  
**Universidad:** Universidad Latina de Costa Rica — Sede Santa Cruz  
**Período:** I Cuatrimestre 2026

