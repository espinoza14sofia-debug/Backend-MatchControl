# Estructura del Proyecto — MatchControl

MatchControl está dividido en dos partes principales: el backend desarrollado
con NestJS y el frontend desarrollado con React + Vite.

## Raíz del Proyecto
```
MatchControl/
├── Backend-MatchControl/
└── matchcontrol-front/
```

## Backend — `Backend-MatchControl/`

Desarrollado con **NestJS** y **TypeScript**. Se conecta a una base de datos
**Microsoft SQL Server** mediante **TypeORM**.
```
Backend-MatchControl/
├── dist/               # Código compilado generado por TypeScript
├── docs/               # Documentación del proyecto
├── src/                # Código fuente principal
│   ├── auditoria/
│   ├── auth/
│   ├── categoria/
│   ├── configuracion-sistema/
│   ├── disciplina/
│   ├── equipo/
│   ├── equipo_jugador/
│   ├── fase/
│   ├── grupo/
│   ├── match/
│   ├── match_participante/
│   ├── match_set/
│   ├── notificacion/
│   ├── organizacion/
│   ├── participante/
│   ├── posiciones/
│   ├── rol/
│   ├── sancion/
│   ├── solicitud_rol/
│   ├── torneo/
│   ├── usuario/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/               # Pruebas del proyecto
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── tsconfig.build.json
```

Cada módulo dentro de `src/` sigue la misma estructura:
```
modulo/
├── modulo.controller.ts
├── modulo.service.ts
├── modulo.module.ts
└── entities/
    └── modulo.entity.ts
```

## Frontend — `matchcontrol-front/`

Desarrollado con **React**, **Vite** y **TailwindCSS**.
```
matchcontrol-front/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/         # Imágenes y recursos estáticos
│   ├── pages/          # Vistas o páginas de la aplicación
│   ├── services/       # Llamadas a la API del backend
│   ├── App.jsx         # Componente raíz
│   ├── index.css       # Estilos globales
│   └── main.jsx        # Punto de entrada de la aplicación
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tailwind.config.js
└── vite.config.js
```