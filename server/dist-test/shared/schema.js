"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.statisticsRelations = exports.matchesRelations = exports.teamsRelations = exports.usersRelations = exports.insertStatisticsSchema = exports.statistics = exports.insertMatchSchema = exports.matches = exports.insertTeamSchema = exports.teams = exports.insertUserSchema = exports.users = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_orm_1 = require("drizzle-orm");
var drizzle_zod_1 = require("drizzle-zod");
var zod_1 = require("zod");
// User model (players and admins)
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.integer)("id").primaryKey(), // ID personnalisé à 6 chiffres
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    role: (0, pg_core_1.text)("role").notNull().default("player"), // player, admin, superadmin
    teamId: (0, pg_core_1.integer)("team_id"),
    statisticsId: (0, pg_core_1.integer)("statistics_id"),
    dateRegistered: (0, pg_core_1.timestamp)("date_registered").defaultNow(),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).omit({
    id: true,
    dateRegistered: true,
    statisticsId: true,
});
// Teams model
exports.teams = (0, pg_core_1.pgTable)("teams", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull().unique(),
    logo: (0, pg_core_1.text)("logo"), // URL to the logo
    captainId: (0, pg_core_1.integer)("captain_id"),
    players: (0, pg_core_1.json)("players").default([]), // Array of player IDs
    points: (0, pg_core_1.integer)("points").default(0),
    matchesPlayed: (0, pg_core_1.integer)("matches_played").default(0),
});
exports.insertTeamSchema = (0, drizzle_zod_1.createInsertSchema)(exports.teams).omit({
    id: true,
    points: true,
    matchesPlayed: true,
});
// Matches model
exports.matches = (0, pg_core_1.pgTable)("matches", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    team1Id: (0, pg_core_1.integer)("team_1_id").notNull(),
    team2Id: (0, pg_core_1.integer)("team_2_id").notNull(),
    scoreTeam1: (0, pg_core_1.integer)("score_team_1").default(0),
    scoreTeam2: (0, pg_core_1.integer)("score_team_2").default(0),
    matchDate: (0, pg_core_1.timestamp)("match_date").notNull(),
    status: (0, pg_core_1.text)("status").notNull().default("pending"), // pending, in_progress, completed
});
exports.insertMatchSchema = (0, drizzle_zod_1.createInsertSchema)(exports.matches).omit({
    id: true,
    scoreTeam1: true,
    scoreTeam2: true,
});
// Statistics model
exports.statistics = (0, pg_core_1.pgTable)("statistics", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    playerId: (0, pg_core_1.integer)("player_id").notNull().unique(),
    goalsScored: (0, pg_core_1.integer)("goals_scored").default(0),
    assists: (0, pg_core_1.integer)("assists").default(0),
    yellowCards: (0, pg_core_1.integer)("yellow_cards").default(0),
    redCards: (0, pg_core_1.integer)("red_cards").default(0),
});
exports.insertStatisticsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.statistics).omit({
    id: true,
    goalsScored: true,
    assists: true,
    yellowCards: true,
    redCards: true,
});
// Définition explicite des relations
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, function (_a) {
    var one = _a.one;
    return ({
        team: one(exports.teams, {
            fields: [exports.users.teamId],
            references: [exports.teams.id],
        }),
        statistics: one(exports.statistics, {
            fields: [exports.users.statisticsId],
            references: [exports.statistics.id],
        }),
    });
});
exports.teamsRelations = (0, drizzle_orm_1.relations)(exports.teams, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        captain: one(exports.users, {
            fields: [exports.teams.captainId],
            references: [exports.users.id],
        }),
        teamMembers: many(exports.users),
    });
});
exports.matchesRelations = (0, drizzle_orm_1.relations)(exports.matches, function (_a) {
    var one = _a.one;
    return ({
        team1: one(exports.teams, {
            fields: [exports.matches.team1Id],
            references: [exports.teams.id],
        }),
        team2: one(exports.teams, {
            fields: [exports.matches.team2Id],
            references: [exports.teams.id],
        }),
    });
});
exports.statisticsRelations = (0, drizzle_orm_1.relations)(exports.statistics, function (_a) {
    var one = _a.one;
    return ({
        player: one(exports.users, {
            fields: [exports.statistics.playerId],
            references: [exports.users.id],
        }),
    });
});
// Authentication types
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
