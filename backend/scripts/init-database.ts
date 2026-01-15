import { Pool, PoolClient } from 'pg';

async function createTables(client: PoolClient): Promise<void> {
  const queries = [
    `CREATE TABLE IF NOT EXISTS familias (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS articulos (
      id SERIAL PRIMARY KEY,
      familia_id INTEGER NOT NULL,
      name VARCHAR(150) NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_articulo_familia FOREIGN KEY (familia_id) REFERENCES familias(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      discount_type VARCHAR(10) NULL,
      discount_value DECIMAL(10,2) NULL,
      total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS tickets_lineas (
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
      CONSTRAINT fk_linea_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
      CONSTRAINT fk_linea_articulo FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE RESTRICT
    )`,
    `CREATE TABLE IF NOT EXISTS datos_empresa (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      nif VARCHAR(20) NOT NULL UNIQUE,
      address VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NULL,
      email VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const query of queries) {
    await client.query(query);
  }
}

async function checkTablesExist(client: PoolClient): Promise<boolean> {
  const result = await client.query(`
    SELECT COUNT(*) as count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('familias', 'articulos', 'tickets', 'tickets_lineas', 'datos_empresa')
  `);

  return parseInt(result.rows[0].count) === 5;
}

async function initDatabase(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL no está definida en las variables de entorno');
    process.exit(1);
  }

  console.log('🔗 Conectando a la base de datos...');

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const client = await pool.connect();

    try {
      const tablesExist = await checkTablesExist(client);

      if (tablesExist) {
        console.log('✅ Las tablas de la base de datos ya existen');
      } else {
        console.log('⚠️ Las tablas no existen, creando estructura...');
        await createTables(client);
        console.log('✅ Estructura de base de datos creada exitosamente');
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
