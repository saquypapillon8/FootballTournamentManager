const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:saquy0000@localhost:5432/foottournoi"
});

console.log('✅ Connexion PostgreSQL établie');

module.exports = {
  db: drizzle(pool),
  pool
};
