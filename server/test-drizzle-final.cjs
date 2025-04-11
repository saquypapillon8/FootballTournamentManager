const { db } = require('./db-commonjs.cjs');
const { teams } = require('./schema.cjs');

async function test() {
  try {
    const result = await db.select().from(teams);
    console.log('✅ Teams:', result);
    
    const [newTeam] = await db.insert(teams)
      .values({ name: 'Équipe Test Drizzle' })
      .returning();
    console.log('➕ Team ajoutée:', newTeam);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

test();