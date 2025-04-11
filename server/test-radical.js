const { Client } = require('pg');
console.log('Démarrage du test radical...');

const client = new Client({
  connectionString: "postgresql://postgres:saquy0000@localhost:5432/foottournoi"
});

client.connect()
  .then(() => client.query('SELECT 1+1 AS result'))
  .then(res => console.log('✅ PostgreSQL répond. 1+1 =', res.rows[0].result))
  .catch(err => console.error('❌ Échec critique:', err))
  .finally(() => {
    client.end();
    console.log('Test terminé');
  });