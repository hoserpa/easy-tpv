# Scripts de base de datos

Este directorio contiene scripts para la gestión de la base de datos.

## init-database.ts

Script que verifica y crea la estructura de la base de datos.

### Funcionamiento

1. Se conecta a la base de datos usando la variable `DATABASE_URL`
2. Verifica si las tablas necesarias existen
3. Si no existen, crea todas las tablas:
   - `familias`
   - `articulos`
   - `tickets`
   - `tickets_lineas`
   - `datos_empresa`

### Uso

Desde el directorio `backend`:

```bash
# Ejecutar el script
npm run db:init

# O directamente con ts-node
ts-node scripts/init-database.ts
```

### Variables de entorno requeridas

Asegúrate de que el archivo `.env` tenga la variable `DATABASE_URL` configurada:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/easy_tpv
```

### Notas

- El script es idempotente: se puede ejecutar múltiples veces sin causar errores
- Usa `CREATE TABLE IF NOT EXISTS` para evitar conflictos
- Crea todas las restricciones de claves foráneas necesarias
