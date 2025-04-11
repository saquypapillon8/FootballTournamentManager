const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT 1 as test');
    console.log('✅ Connexion réussie !', res.rows);
  } catch (err) {
    console.error('❌ Erreur de connexion :', err);
  } finally {
    await client.end();
  }
}

test();
