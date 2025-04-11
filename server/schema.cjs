const { pgTable, varchar, text, boolean, serial } = require('drizzle-orm/pg-core');

// Schéma Users
const users = pgTable('users', {
  id: serial('id').primaryKey(), // Changé de varchar à serial
  username: varchar('username').unique().notNull(),
  password_hash: text('password_hash').notNull(),
  role: varchar('role')
});

// Schéma Teams (conservé depuis votre ancienne version)
const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull()
});

module.exports = { users, teams };