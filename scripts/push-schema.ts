import { db } from '../server/db';
import { sql } from 'drizzle-orm';

// Fonction pour pousser le schéma vers la base de données
async function pushSchema() {
  try {
    console.log('Mise à jour de la base de données...');

    // Supprimer les tables existantes s'il y a des incohérences de schéma
    await db.execute(sql`
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS teams CASCADE;
      DROP TABLE IF EXISTS matches CASCADE;
      DROP TABLE IF EXISTS statistics CASCADE;
    `);

    // Recréer les tables avec le schéma correct
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'player',
        team_id INTEGER,
        statistics_id INTEGER,
        date_registered TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        logo TEXT,
        captain_id INTEGER,
        players JSONB DEFAULT '[]',
        points INTEGER DEFAULT 0,
        matches_played INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        team_1_id INTEGER NOT NULL,
        team_2_id INTEGER NOT NULL,
        score_team_1 INTEGER DEFAULT 0,
        score_team_2 INTEGER DEFAULT 0,
        match_date TIMESTAMP NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
      );

      CREATE TABLE IF NOT EXISTS statistics (
        id SERIAL PRIMARY KEY,
        player_id INTEGER NOT NULL UNIQUE,
        goals_scored INTEGER DEFAULT 0,
        assists INTEGER DEFAULT 0,
        yellow_cards INTEGER DEFAULT 0,
        red_cards INTEGER DEFAULT 0
      );
    `);

    // Ajouter les contraintes de clé étrangère
    await db.execute(sql`
      ALTER TABLE users 
        ADD CONSTRAINT users_team_id_fkey 
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

      ALTER TABLE users 
        ADD CONSTRAINT users_statistics_id_fkey 
        FOREIGN KEY (statistics_id) REFERENCES statistics(id) ON DELETE SET NULL;

      ALTER TABLE teams 
        ADD CONSTRAINT teams_captain_id_fkey 
        FOREIGN KEY (captain_id) REFERENCES users(id) ON DELETE SET NULL;

      ALTER TABLE matches 
        ADD CONSTRAINT matches_team_1_id_fkey 
        FOREIGN KEY (team_1_id) REFERENCES teams(id) ON DELETE CASCADE;

      ALTER TABLE matches 
        ADD CONSTRAINT matches_team_2_id_fkey 
        FOREIGN KEY (team_2_id) REFERENCES teams(id) ON DELETE CASCADE;

      ALTER TABLE statistics 
        ADD CONSTRAINT statistics_player_id_fkey 
        FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE;
    `);

    console.log('Schéma mis à jour avec succès!');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du schéma:', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter la fonction
pushSchema();