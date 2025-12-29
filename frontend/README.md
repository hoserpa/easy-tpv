# Easy TPV - Frontend

Frontend de una aplicación TPV (Terminal Punto de Venta) web sencilla, optimizada para pantallas táctiles y pequeña empresas.

## 🎯 Propósito del proyecto

Este frontend es la interfaz de usuario para un sistema TPV básico que permite:
- Gestionar familias de productos
- Gestionar artículos
- Crear y gestionar tickets de venta
- Interfaz táctil amigable para uso diario en comercios

## 🛠️ Stack Tecnológico

- **TypeScript** - Tipado estático para mayor robustez
- **Next.js 14+** - Framework de React en modo SPA/estático (sin SSR)
- **React** - Biblioteca para construir la interfaz de usuario
- **Tailwind CSS** - Framework de CSS para estilos rápidos y responsivos
- **React Context** - Gestión de estado global sin librerías externas

## 📁 Estructura del proyecto

```
src/
├── app/                    # Estructura de Next.js App Router
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal de la aplicación
│   └── page.tsx           # Página principal (TPV)
├── components/            # Componentes reutilizables
│   ├── ConfigModal.tsx    # Modal de configuración
│   └── Modal.tsx          # Componente modal genérico
└── services/              # Servicios y utilidades
    └── api.ts             # Cliente API para comunicación con backend
```

## 🚀 Comandos de desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar linting (revisar calidad del código)
npm run lint

# Verificación de tipos TypeScript
npm run type-check

# Ejecutar tests
npm test

# Ejecutar test específico
npm test -- --testNamePattern="nombre_del_test"
```

## 🧱 Componentes principales

### Layout (`app/layout.tsx`)
- Define la estructura base de la aplicación
- Incluye metadatos y configuración global
- Envuelve todas las páginas con estilos y proveedores de contexto

### Página Principal (`app/page.tsx`)
- Interfaz principal del TPV
- Diseño optimizado para táctil:
  - **Parte izquierda**: Resumen del ticket (arriba) y calculadora (abajo)
  - **Parte derecha**: Familias de productos (arriba) y artículos (abajo)

### Modal (`components/Modal.tsx`)
- Componente modal reutilizable
- Maneja apertura/cierre con estado interno
- Acepta children para contenido personalizado

### ConfigModal (`components/ConfigModal.tsx`)
- Modal específico para configuración de la aplicación
- Utiliza el componente Modal base

### API Service (`services/api.ts`)
- Cliente HTTP para comunicarse con el backend
- Maneja URLs base, cabeceras y errores comunes
- Exporta funciones para cada endpoint de la API

## 🎨 Convenciones de código

### TypeScript
- Usar tipado estricto siempre
- Preferir `interface` para objetos y `type` para uniones/primitivos
- Nombres de componentes en PascalCase
- Nombres de variables y funciones en camelCase

### React
- Componentes funcionales con hooks
- Props tipadas explícitamente
- Usar `React.FC` solo cuando sea necesario
- Manejo de errores con try-catch en operaciones asíncronas

### Estilos (Tailwind)
- Clases responsive优先 (mobile-first)
- Botones grandes y espaciados para interfaz táctil
- Consistencia en colores y espaciado

## 🔗 Comunicación con el backend

El frontend se comunica con el backend mediante REST API:

```typescript
// Ejemplo de uso del servicio API
import { createTicket, getFamilies } from '../services/api';

// Obtener familias
const families = await getFamilies();

// Crear un ticket
const ticket = await createTicket(ticketData);
```

## 📱 Optimización táctil

- Botones con `min-h-[44px]` (44px mínimo para área táctil)
- Espaciado generoso entre elementos interactivos
- Feedback visual en hover/active states
- Diseño que funciona en modo horizontal (landscape)

## 🌐 PWA Features

La aplicación está configurada para funcionar como Progressive Web App:
- Pantalla completa sin interfaz del navegador
- Acceso rápido desde pantalla de inicio
- Soporte offline básico

## 🐛 Desarrollo y depuración

### Herramientas recomendadas
- React Developer Tools
- Tailwind CSS IntelliSense (para VS Code)
- TypeScript ESLint

### Errores comunes
- Verificar que el backend esté corriendo en el puerto configurado
- Revisar console.log() para errores de red
- Usar Network tab en DevTools para inspeccionar peticiones API

## 🚀 Despliegue

### Desarrollo local
```bash
npm run dev
# Acceder a http://localhost:3000
```

### Producción
```bash
npm run build
npm start
```

La aplicación genera archivos estáticos optimizados que pueden servirse desde cualquier servidor web o plataforma de despliegue (Vercel, Netlify, etc.).

## 🔧 Configuración

### Variables de entorno
Crear archivo `.env.local` para variables locales:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Tailwind CSS
La configuración está en `tailwind.config.js` y `postcss.config.js`.
Se pueden personalizar colores y breakpoints según necesidades.

## 📖 Guía para programadores junior

### Primeros pasos
1. Familiarizarse con la estructura de archivos Next.js App Router
2. Entender el flujo de datos: componentes ↔ servicios API ↔ backend
3. Revisar los componentes existentes antes de crear nuevos

### Añadir nueva funcionalidad
1. Crear componente en `components/`
2. Añadir servicio en `services/api.ts` si es necesario
3. Importar y usar en `app/page.tsx` u otra página
4. No olvidar tipar las props y datos

### Buenas prácticas
- Mantener componentes pequeños y enfocados
- Usar nombres descriptivos en español
- Reutilizar componentes existentes
- Probar la interfaz en diferentes tamaños de pantalla
- Considerar siempre el uso táctil al diseñar UI
