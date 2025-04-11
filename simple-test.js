const { db } = require('./server/db');

async function testConnection() {
  try {
    // Test simple qui ne dépend pas des schémas
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Connexion réussie !', result);
  } catch (error) {
    console.error('❌ Erreur de connexion :', error);
  } finally {
    process.exit();
  }
}

testConnection();
