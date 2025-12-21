# Easy TPV

TPV web sencillo para pequeñas empresas, optimizado para pantallas táctiles.

## 🏗️ Arquitectura

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **Base de datos**: MySQL/MariaDB
- **Despliegue**: PWA (Progressive Web App)

## 📁 Estructura del Proyecto

```
easy-tpv/
├── frontend/          # Aplicación Next.js
├── backend/           # API NestJS
└── AGENTS.md         # Guías para desarrolladores
```

## 🚀 Configuración Rápida

### Backend

```bash
cd backend
npm install
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:3001`

## 🧪 Tests

### Backend

#### Ejecutar todos los tests unitarios
```bash
cd backend
npm test
```

#### Ejecutar tests específicos
```bash
# Tests del servicio de familias
npm test -- --testPathPattern=familias.service.spec.ts

# Tests del servicio de artículos  
npm test -- --testPathPattern=articulos.service.spec.ts

# Tests del servicio de tickets
npm test -- --testPathPattern=tickets.service.spec.ts
```

#### Ejecutar tests e2e
```bash
cd backend
npm run test:e2e

# Tests e2e específicos
npm run test:e2e -- --testNamePattern="Familias API"
npm run test:e2e -- --testNamePattern="Articulos API" 
npm run test:e2e -- --testNamePattern="Tickets API"
```

#### Verificar código
```bash
cd backend
npm run lint        # Linting
npm run build       # Compilación TypeScript
```

### Frontend

```bash
cd frontend
npm test             # Ejecutar tests
npm run lint         # Linting
npm run type-check   # Verificación TypeScript
npm run build        # Compilación para producción
```

## 📡 API Endpoints

### Familias
- `GET /familias` - Listar todas las familias
- `POST /familias` - Crear nueva familia
- `GET /familias/:id` - Obtener familia específica
- `PATCH /familias/:id` - Actualizar familia
- `DELETE /familias/:id` - Eliminar familia

### Artículos
- `GET /articulos` - Listar todos los artículos
- `GET /articulos/family/:familyId` - Listar artículos por familia
- `POST /articulos` - Crear nuevo artículo
- `GET /articulos/:id` - Obtener artículo específico
- `PATCH /articulos/:id` - Actualizar artículo
- `DELETE /articulos/:id` - Eliminar artículo

### Tickets
- `GET /tickets` - Listar todos los tickets
- `POST /tickets` - Crear nuevo ticket
- `GET /tickets/:id` - Obtener ticket con líneas
- `GET /tickets/:id/lines` - Obtener solo líneas del ticket

## 💡 Ejemplos de Uso

### Crear una familia
```bash
curl -X POST http://localhost:3000/familias \
  -H "Content-Type: application/json" \
  -d '{"name": "Bebidas"}'
```

### Crear un artículo
```bash
curl -X POST http://localhost:3000/articulos \
  -H "Content-Type: application/json" \
  -d '{"family_id": 1, "name": "Coca Cola", "price": 1.50}'
```

### Crear un ticket
```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "lines": [
      {"item_id": 1, "qty": 2, "unit_price": 1.50},
      {"item_id": 2, "qty": 1, "unit_price": 2.00}
    ],
    "discount_type": "fixed",
    "discount_value": 0.50
  }'
```

## 📋 Requisitos

- Node.js 18+
- MySQL/MariaDB
- npm o yarn

## 🤖 Guía para Agentes

Ver `AGENTS.md` para详细了解 las convenciones de código, estructura del proyecto y reglas de desarrollo.

## 📄 Licencia

Proyecto de código abierto para pequeños comercios.
