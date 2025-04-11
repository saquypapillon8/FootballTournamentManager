import { db } from './db.js';
import { users } from '../shared/schema.js';

async function testConnection() {
  try {
    const result = await db.select().from(users).limit(1);
    console.log('✅ Connexion réussie !', result);
  } catch (error) {
    console.error('❌ Erreur de connexion :', error);
  }
}

testConnection();