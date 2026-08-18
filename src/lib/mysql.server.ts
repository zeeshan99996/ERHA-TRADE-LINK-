import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;
let schemaEnsured = false;

export function isMysqlConfigured(): boolean {
  return (
    Boolean(process.env.DB_HOST) &&
    Boolean(process.env.DB_USER) &&
    Boolean(process.env.DB_NAME)
  );
}

export function getMysqlPool(): mysql.Pool | null {
  if (!isMysqlConfigured()) return null;

  if (!pool) {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME;
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }

  return pool;
}

async function ensureSchema(db: mysql.Pool) {
  if (schemaEnsured) return;
  schemaEnsured = true;
  try {
    await db.execute("ALTER TABLE products MODIFY COLUMN image LONGTEXT NULL");
  } catch {}
  try {
    await db.execute("ALTER TABLE products MODIFY COLUMN shortdescription LONGTEXT NULL");
  } catch {}
  try {
    await db.execute("ALTER TABLE categories MODIFY COLUMN imageurl LONGTEXT NULL");
  } catch {}
}

export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getMysqlPool();
  if (!db) {
    throw new Error('Hostinger MySQL Database environment variables (DB_HOST, DB_USER, DB_NAME) are not set.');
  }
  await ensureSchema(db);
  const [rows] = await db.execute(sql, params);
  return rows as T[];
}
