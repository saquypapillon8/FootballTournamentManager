const { db } = require('./db-commonjs.cjs');
const { users } = require('./schema.cjs'); // Import manquant
const { eq } = require('drizzle-orm'); // Import manquant
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Pour randomUUID()

// ... reste du code inchangé ...

async function register(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db.insert(users).values({ 
      // Supprimez complètement la ligne id
      username, 
      password_hash: hashedPassword,
      role: 'player'
    });
  }

  async function login(username, password) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) throw new Error('Utilisateur non trouvé');
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error('Mot de passe incorrect');
    
    return jwt.sign({ userId: user.id, role: user.role }, 'votre_cle_secrete');
  }

module.exports = { register, login };