import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg'; // Utilisez Pool au lieu de postgres

const connectionString = "postgresql://postgres:saquy0000@localhost:5432/foottournoi";
const pool = new Pool({ connectionString });

// Solution universelle
const db = drizzle(pool);

// Export en CommonJS et ES Modules
module.exports = { db, pool };
export { db, pool };