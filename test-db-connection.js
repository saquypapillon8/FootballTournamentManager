const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:saquy0000@localhost:5432/foottournoi?options=-c%20search_path=public"
});

async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT 1');
    console.log(' Connexion réussie:', res.rows);
  } catch (err) {
    console.error(' Erreur de connexion:', err);
  } finally {
    await client.end();
  }
}

test();