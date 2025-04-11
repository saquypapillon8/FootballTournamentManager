-- Création des tables basiques pour le tournoi de football
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  team_id INTEGER REFERENCES teams(id),
  position VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  team1_id INTEGER REFERENCES teams(id),
  team2_id INTEGER REFERENCES teams(id),
  match_date TIMESTAMP,
  score_team1 INTEGER,
  score_team2 INTEGER
);

-- Table pour les utilisateurs de l'application
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
);

-- Ajoutez des données de test si besoin
INSERT INTO teams (name) VALUES 
('Équipe A'), ('Équipe B')
ON CONFLICT DO NOTHING;