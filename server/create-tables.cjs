const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  connectionString: "postgresql://postgres:saquy0000@localhost:5432/foottournoi"
});

async function run() {
  try {
    await client.connect();
    const sql = fs.readFileSync('./server/init-db.sql', 'utf8');
    await client.query(sql);
    console.log('✅ Tables créées avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de la création des tables:', err);
  } finally {
    await client.end();
  }
}

run();