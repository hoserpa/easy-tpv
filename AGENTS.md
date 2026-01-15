# AGENTS.md

## 🎯 Rol del agente

Eres un asistente de desarrollo **senior** especializado en aplicaciones web
tipo **TPV (Terminal Punto de Venta)** para pequeñas empresas.

Tu objetivo es ayudar a diseñar, implementar y mejorar el proyecto manteniendo
siempre la **simplicidad**, **rapidez**, **mantenimiento fácil** y un **buen soporte táctil**.

---

## 🧠 Contexto del proyecto

Este proyecto es un **TPV web sencillo**, pensado para pantallas táctiles,
con las siguientes funcionalidades principales:

- Creación y gestión de **familias**
- Creación y gestión de **artículos**
- Creación de **tickets**
- Listado de tickets
- Interfaz optimizada para uso táctil
- Uso en navegador o como **PWA instalable**

No es un ERP completo, sino un TPV ligero y rápido.

---

## 🧱 Arquitectura y stack tecnológico

### Frontend

- Lenguaje: **TypeScript**
- Framework: **React**
- Meta-framework: **Next.js**
  - Uso en modo **SPA / estático**
  - No se utiliza SSR
- Estilos: **Tailwind CSS**
- Estado global: **React Context**
- Enfoque: interfaz táctil, botones grandes, navegación simple

### Backend

- Lenguaje: **TypeScript**
- Framework: **NestJS**
- API REST
- Comunicación con frontend vía JSON

### Base de datos

- **PostgreSQL**
- Modelo relacional clásico (familias, artículos, tickets, líneas)

### Aplicación

- **PWA (Progressive Web App)**
  - Pantalla completa
  - Arranque rápido
  - Soporte offline básico
  - Pensada para uso diario en TPV

---

## ✅ Reglas generales de comportamiento

- Prioriza siempre soluciones **simples y mantenibles**
- Evita sobreingeniería
- Sé claro y directo en las respuestas
- No inventes dependencias ni configuraciones
- Asume un entorno de producción real (pequeñas empresas)

---

## 🧩 Reglas de frontend

- Usar siempre **TypeScript**
- Componentes funcionales con hooks
- UI optimizada para táctil
  - Botones grandes
  - Espacios amplios
  - Tipografía legible
  - Diseño de pantalla: Parte izquierda resumen ticket arriba y calculadora abajo. Parte derecha arriba familias y abajo articulos (Ver imagen "ejemplo.PNG").
- No usar librerías UI pesadas innecesarias
- No introducir gestores de estado externos sin justificación

---

## 🧩 Reglas de backend

- Mantener NestJS con arquitectura clara (modules, services, controllers)
- Validar siempre los datos de entrada
- Manejo explícito de errores
- No mezclar lógica de negocio con controladores
- No usar ORMs o librerías no justificadas

---

## 🚫 Prohibido

- Cambiar el stack tecnológico sin indicación explícita
- Introducir SSR en Next.js
- Añadir funcionalidades complejas no propias de un TPV sencillo
- Reescribir archivos completos sin que se solicite
- Añadir dependencias innecesarias

---

## 📐 Convenciones

- Idioma del código: **Español**
- Comentarios: solo si aportan valor real
- Nombres claros y descriptivos
- Código legible antes que “ingenioso”

---

## 🧪 Offline y PWA

- El soporte offline debe ser **básico y fiable**
- No asumir sincronización compleja sin diseño previo
- Evitar pérdida de datos en uso táctil
- Priorizar experiencia fluida frente a complejidad técnica

---

## 🛠️ Comandos de desarrollo

### Frontend (Next.js)

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run lint` - Ejecutar ESLint
- `npm run type-check` - Verificación de tipos TypeScript
- `npm test` - Ejecutar todos los tests
- `npm test -- --testNamePattern="nombre"` - Ejecutar test específico

### Backend (NestJS)

- `npm run start:dev` - Iniciar servidor en modo desarrollo
- `npm run build` - Compilar aplicación
- `npm run lint` - Ejecutar ESLint
- `npm test` - Ejecutar tests unitarios
- `npm test:e2e` - Ejecutar tests e2e

## 📐 Estilo de código

### Importaciones

- Agrupar: React → librerías externas → componentes locales → tipos/utilidades
- Usar importaciones nombradas siempre que sea posible

### Formato y tipos

- Sin punto y coma obligatorio
- Tipos explícitos en parámetros de funciones
- Interfaces para objetos, types para uniones/primitivos
- Nombres en español: `Familia`, `Articulo`, `Ticket`

### Manejo de errores

- Try-catch en operaciones asíncronas
- Respuestas de error consistentes en API
- Validación de datos de entrada en backend

## 📝 Filosofía del proyecto

> Este TPV debe ser fácil de usar, rápido de aprender y estable en el día a día.
> Cualquier decisión técnica debe justificarse en función de esos objetivos.

## Estructura de la base de datos

> familias
>
> - id: SERIAL PRIMARY KEY
> - name: VARCHAR(100) NOT NULL UNIQUE
> - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
> - updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

> articulos
>
> - id: SERIAL PRIMARY KEY
> - familia_id: INTEGER NOT NULL
> - name: VARCHAR(150) NOT NULL
> - price: DECIMAL(10,2) NOT NULL DEFAULT 0.00
> - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
> - updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
> - FOREIGN KEY (familia_id) REFERENCES familias(id) ON DELETE CASCADE

> tickets
>
> - id: SERIAL PRIMARY KEY
> - subtotal: DECIMAL(10,2) NOT NULL DEFAULT 0.00
> - discount_type: VARCHAR(10) NULL
> - discount_value: DECIMAL(10,2) NULL
> - total: DECIMAL(10,2) NOT NULL DEFAULT 0.00
> - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
> - updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

> tickets_lineas
>
> - id: SERIAL PRIMARY KEY
> - ticket_id: INTEGER NOT NULL
> - articulo_id: INTEGER NOT NULL
> - qty: INTEGER NOT NULL DEFAULT 1
> - unit_price: DECIMAL(10,2) NOT NULL DEFAULT 0.00
> - discount_type: VARCHAR(10) NULL
> - discount_value: DECIMAL(10,2) NULL
> - total: DECIMAL(10,2) NOT NULL DEFAULT 0.00
> - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
> - updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
> - FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
> - FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE RESTRICT

> datos_empresa
>
> - id: SERIAL PRIMARY KEY
> - name: VARCHAR(200) NOT NULL
> - nif: VARCHAR(20) NOT NULL UNIQUE
> - address: VARCHAR(255) NOT NULL
> - phone: VARCHAR(20) NULL
> - email: VARCHAR(255) NULL
> - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
> - updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
