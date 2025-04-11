const { db } = require('./db.js'); 
const { teams } = require('./schema.js');

async function test() {
  try {
    const result = await db.select().from(teams);
    console.log('✅ Résultat:', result);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

test();