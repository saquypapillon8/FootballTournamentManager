import { pgTable, text, serial, integer, boolean, timestamp, json, primaryKey } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model (players and admins)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("player"), // player, admin, superadmin
  teamId: integer("team_id"),
  statisticsId: integer("statistics_id"),
  dateRegistered: timestamp("date_registered").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  dateRegistered: true,
  statisticsId: true,
});

// Teams model
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logo: text("logo"), // URL to the logo
  captainId: integer("captain_id"),
  players: json("players").default([]), // Array of player IDs
  points: integer("points").default(0),
  matchesPlayed: integer("matches_played").default(0),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  points: true,
  matchesPlayed: true,
});

// Matches model
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  team1Id: integer("team_1_id").notNull(),
  team2Id: integer("team_2_id").notNull(),
  scoreTeam1: integer("score_team_1").default(0),
  scoreTeam2: integer("score_team_2").default(0),
  matchDate: timestamp("match_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  scoreTeam1: true,
  scoreTeam2: true,
});

// Statistics model
export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull().unique(),
  goalsScored: integer("goals_scored").default(0),
  assists: integer("assists").default(0),
  yellowCards: integer("yellow_cards").default(0),
  redCards: integer("red_cards").default(0),
});

export const insertStatisticsSchema = createInsertSchema(statistics).omit({
  id: true,
  goalsScored: true,
  assists: true,
  yellowCards: true,
  redCards: true,
});

// Définition explicite des relations
export const usersRelations = relations(users, ({ one }) => ({
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
  }),
  statistics: one(statistics, {
    fields: [users.statisticsId],
    references: [statistics.id],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  captain: one(users, {
    fields: [teams.captainId],
    references: [users.id],
  }),
  teamMembers: many(users),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  team1: one(teams, {
    fields: [matches.team1Id],
    references: [teams.id],
  }),
  team2: one(teams, {
    fields: [matches.team2Id],
    references: [teams.id],
  }),
}));

export const statisticsRelations = relations(statistics, ({ one }) => ({
  player: one(users, {
    fields: [statistics.playerId],
    references: [users.id],
  }),
}));

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export type InsertStatistics = z.infer<typeof insertStatisticsSchema>;
export type Statistics = typeof statistics.$inferSelect;

// Authentication types
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
