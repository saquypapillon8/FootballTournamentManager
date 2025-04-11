const { Client } = require('pg');

const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'foottournoi',
  password: 'saquy0000',
  port: 5432,
};

const client = new Client(config);

async function testConnection() {
  try {
    await client.connect();
    const res = await client.query('SELECT 1 AS test');
    console.log('Résultat du test:', res.rows[0].test === 1 ? '✅ Success' : '❌ Failed');
  } catch (err) {
    console.error('Erreur de connexion:', err.message);
  } finally {
    await client.end();
    process.exit();
  }
}

testConnection();