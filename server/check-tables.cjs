const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:saquy0000@localhost:5432/foottournoi"
});

async function checkTables() {
  await client.connect();
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  console.log('Tables existantes:', res.rows.length ? res.rows : 'Aucune table trouvée');
  await client.end();
}

checkTables().catch(console.error);