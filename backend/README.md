# Easy TPV - Backend

API REST para un sistema TPV (Terminal Punto de Venta) sencillo, construido con NestJS y TypeScript.

## 🎯 Propósito del proyecto

Backend que proporciona los servicios necesarios para una aplicación TPV básica:
- Gestión de familias de productos
- Gestión de artículos
- Creación y gestión de tickets de venta
- Gestión de datos de la empresa
- API REST para consumo del frontend

## 🛠️ Stack Tecnológico

- **TypeScript** - Tipado estático para mayor robustez
- **Node.js** - Entorno de ejecución JavaScript
- **NestJS** - Framework para construir APIs eficientes y escalables
- **PostgreSQL** - Base de datos relacional
- **API REST** - Arquitectura de servicios web

## 📁 Estructura del proyecto

```
src/
├── common/                 # Código compartido entre módulos
│   ├── dto/               # Data Transfer Objects
│   │   ├── create-*.dto.ts    # DTOs para creación
│   │   └── update-*.dto.ts    # DTOs para actualización
│   └── entities/          # Entidades de base de datos
│       ├── articulo.entity.ts
│       ├── datos-empresa.entity.ts
│       ├── familia.entity.ts
│       ├── ticket-line.entity.ts
│       └── ticket.entity.ts
├── config/                # Configuración de la aplicación
│   └── database.config.ts # Configuración de base de datos
├── modules/               # Módulos funcionales
│   ├── articulos/         # Gestión de artículos
│   │   ├── articulos.controller.ts
│   │   ├── articulos.module.ts
│   │   ├── articulos.service.spec.ts
│   │   └── articulos.service.ts
│   ├── familias/          # Gestión de familias
│   │   ├── familias.controller.ts
│   │   ├── familias.module.ts
│   │   ├── familias.service.spec.ts
│   │   └── familias.service.ts
│   └── tickets/           # Gestión de tickets
│       ├── tickets.controller.ts
│       ├── tickets.module.ts
│       ├── tickets.service.spec.ts
│       └── tickets.service.ts
│   └── datos-empresa/      # Gestión de datos de la empresa
│       ├── datos-empresa.controller.ts
│       ├── datos-empresa.module.ts
│       ├── datos-empresa.service.spec.ts
│       └── datos-empresa.service.ts
├── app.controller.ts      # Controlador principal
├── app.module.ts          # Módulo raíz
├── app.service.ts         # Servicio principal
├── main.ts               # Punto de entrada de la aplicación
test/                     # Tests de integración
└── database-integration.spec.ts
```

## 🚀 Comandos de desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor en modo desarrollo (con hot-reload)
npm run start:dev

# Compilar aplicación
npm run build

# Iniciar servidor en producción
npm run start:prod

# Ejecutar tests unitarios
npm run test

# Ejecutar tests e2e (end-to-end)
npm run test:e2e

# Verificar cobertura de tests
npm run test:cov

# Ejecutar linting (revisar calidad del código)
npm run lint
```

## 🗄️ Estructura de la base de datos

### familias
```sql
CREATE TABLE familias (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### articulos
```sql
CREATE TABLE articulos (
  id SERIAL PRIMARY KEY,
  familia_id INTEGER NOT NULL,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (familia_id) REFERENCES familias(id) ON DELETE CASCADE
);
```

### tickets
```sql
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_type VARCHAR(10) NULL,
  discount_value DECIMAL(10,2) NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### tickets_lineas
```sql
CREATE TABLE tickets_lineas (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL,
  articulo_id INTEGER NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_type VARCHAR(10) NULL,
  discount_value DECIMAL(10,2) NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE RESTRICT
);
```

### datos_empresa
```sql
CREATE TABLE datos_empresa (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  nif VARCHAR(20) NOT NULL UNIQUE,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧱 Arquitectura y patrones

### Módulos
Cada módulo representa una entidad del dominio y contiene:
- **Controller**: Manejo de peticiones HTTP y routing
- **Service**: Lógica de negocio y manipulación de datos
- **Module**: Configuración y dependencias del módulo

### DTOs (Data Transfer Objects)
Definen la estructura de los datos que entran y salen de la API:
- `Create*Dto`: Para creación de entidades
- `Update*Dto`: Para actualización parcial de entidades

### Entidades
Representan las tablas de la base de datos y sus relaciones.

## 🔌 Endpoints de la API

### Familias
```
GET    /familias          # Obtener todas las familias
POST   /familias          # Crear nueva familia
GET    /familias/:id      # Obtener familia por ID
PUT    /familias/:id      # Actualizar familia
DELETE /familias/:id      # Eliminar familia
```

### Artículos
```
GET    /articulos         # Obtener todos los artículos
POST   /articulos         # Crear nuevo artículo
GET    /articulos/:id     # Obtener artículo por ID
PUT    /articulos/:id     # Actualizar artículo
DELETE /articulos/:id     # Eliminar artículo
GET    /articulos/byfamilia/:familiaId  # Obtener artículos por familia
```

### Tickets
```
GET    /tickets           # Obtener todos los tickets
POST   /tickets           # Crear nuevo ticket
GET    /tickets/:id       # Obtener ticket con sus líneas
PUT    /tickets/:id       # Actualizar ticket
DELETE /tickets/:id       # Eliminar ticket
```

### Datos de la Empresa
```
GET    /datos-empresa           # Obtener datos de la empresa
POST   /datos-empresa           # Crear/actualizar datos de la empresa
PUT    /datos-empresa/:id       # Actualizar datos de la empresa
DELETE /datos-empresa/:id       # Eliminar datos de la empresa
```

## 🎨 Convenciones de código

### TypeScript
- Usar tipado estricto siempre
- Interfaces para objetos, types para uniones/primitivos
- Nombres en español: `Familia`, `Articulo`, `Ticket`, `DatosEmpresa`
- Decoradores de NestJS con @ símbolo

### Controladores
- Métodos async await para operaciones asíncronas
- Manejo explícito de errores con HttpStatus
- Validación de DTOs con @Body(), @Param(), @Query()
- Respuestas consistentes: `return objeto;` o `throw new HttpException()`

### Servicios
- Inyección de dependencias con constructor
- Lógica de negocio separada de controladores
- Manejo de excepciones con try-catch
- Métodos descriptivos y enfocados

## 🔧 Configuración

### Variables de entorno
Crear archivo `.env` para configuración local:
```
DATABASE_URL=postgresql://user:password@localhost:5432/easy_tpv
PORT=3001
```

### Base de datos
La configuración está en `src/config/database.config.ts`.
Asegurar que PostgreSQL esté corriendo antes de iniciar la aplicación.

## 🧪 Testing

### Tests unitarios
Cada servicio tiene su archivo `*.service.spec.ts` con tests unitarios:
```bash
npm test
```

### Tests e2e
Tests de integración que prueban flujos completos:
```bash
npm run test:e2e
```

### Cobertura
Verificar el porcentaje de código cubierto por tests:
```bash
npm run test:cov
```

## 🚀 Despliegue

### Desarrollo local
```bash
npm run start:dev
# API disponible en http://localhost:3001
```

### Producción
```bash
npm run build
npm run start:prod
```

## 📖 Guía para programadores junior

### Primeros pasos
1. Entender la arquitectura de módulos de NestJS
2. Revisar la estructura de DTOs y entidades
3. Configurar la base de datos antes de iniciar

### Añadir nueva entidad
1. Crear entidad en `src/common/entities/`
2. Crear DTOs en `src/common/dto/`
3. Crear módulo en `src/modules/`
4. Implementar controller, service y module
5. Registrar el módulo en `app.module.ts`

### Buenas prácticas
- Validar siempre los datos de entrada con DTOs
- Separar lógica de negocio de controladores
- Usar códigos HTTP apropiados (200, 201, 400, 404, 500)
- Manejar excepciones y errores de forma consistente
- Escribir tests para la lógica de negocio
- Mantener nombres en español y descriptivos

### Errores comunes
- Olvidar inyectar dependencias en el constructor
- No manejar casos asíncronos correctamente
- Mezclar lógica de negocio con controladores
- No validar datos de entrada
- Usar tipos any en lugar de tipos específicos

## 🌐 Base de datos y migraciones

La aplicación espera que la base de datos exista previamente. Ejecutar los scripts SQL proporcionados para crear las tablas.

No se utiliza ORM para mantener la simplicidad del proyecto, sino conexiones directas a la base de datos.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
