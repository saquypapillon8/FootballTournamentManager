import { User, InsertUser, Team, InsertTeam, Match, InsertMatch, Statistics, InsertStatistics } from "@shared/schema";
import { users, teams, matches, statistics } from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, and, lt, gt } from "drizzle-orm";
import bcrypt from "bcrypt";

export class DatabaseStorage implements IStorage {
  constructor() {
    // Créer un utilisateur super admin si aucun n'existe
    this.ensureSuperAdmin();
  }

  private async ensureSuperAdmin(): Promise<void> {
    try {
      const superAdmin = await db.select().from(users).where(eq(users.role, "superadmin")).limit(1);
      
      if (superAdmin.length === 0) {
        await this.createUser({
          name: "Admin",
          email: "admin@example.com",
          password: bcrypt.hashSync("admin123", 10),
          role: "superadmin",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création du super admin:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getAllUsers(): Promise<Map<number, User>> {
    try {
      const userList = await db.select().from(users);
      const userMap = new Map<number, User>();
      
      userList.forEach(user => {
        userMap.set(user.id, user);
      });
      
      return userMap;
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      return new Map<number, User>();
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      // Hash password if it's not already hashed
      if (!userData.password.startsWith('$2')) {
        userData.password = bcrypt.hashSync(userData.password, 10);
      }
      
      // Préparation des données pour l'insertion sans spécifier l'ID
      // PostgreSQL va auto-incrémenter l'ID grâce au SERIAL
      const insertData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'player',
        teamId: userData.teamId || null,
        dateRegistered: new Date() // Assurons-nous que la date est définie
      };
      
      // Insertion de l'utilisateur et récupération des données générées
      const [newUser] = await db.insert(users).values(insertData).returning();
      
      // Create initial statistics for player
      if (newUser.role === 'player') {
        const stats = await this.createStatistics({ playerId: newUser.id });
        const [updatedUser] = await db.update(users)
          .set({ statisticsId: stats.id })
          .where(eq(users.id, newUser.id))
          .returning();
        
        return updatedUser;
      }
      
      return newUser;
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    // Hash password if it's being updated and not already hashed
    if (userData.password && !userData.password.startsWith('$2')) {
      userData.password = bcrypt.hashSync(userData.password, 10);
    }
    
    const [updatedUser] = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  // Team methods
  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async getTeamByName(name: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.name, name));
    return team || undefined;
  }

  async getAllTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async createTeam(teamData: InsertTeam): Promise<Team> {
    try {
      // Préparation des données pour l'insertion
      const insertData = {
        name: teamData.name,
        logo: teamData.logo || null,
        captainId: teamData.captainId || null,
        players: teamData.players || [],
        points: 0,
        matchesPlayed: 0
      };
      
      // Insertion de l'équipe et récupération des données générées
      const [newTeam] = await db.insert(teams).values(insertData).returning();
      return newTeam;
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe:", error);
      throw error;
    }
  }

  async updateTeam(id: number, teamData: Partial<Team>): Promise<Team | undefined> {
    const team = await this.getTeam(id);
    if (!team) return undefined;
    
    const [updatedTeam] = await db.update(teams)
      .set(teamData)
      .where(eq(teams.id, id))
      .returning();
    
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<boolean> {
    const result = await db.delete(teams).where(eq(teams.id, id));
    return true; // Si aucune erreur n'est produite, la suppression est réussie
  }

  // Match methods
  async getMatch(id: number): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match || undefined;
  }

  async getAllMatches(): Promise<Match[]> {
    return await db.select().from(matches);
  }

  async getLiveMatches(): Promise<Match[]> {
    return await db.select()
      .from(matches)
      .where(eq(matches.status, 'in_progress'))
      .orderBy(matches.matchDate);
  }

  async getUpcomingMatches(): Promise<Match[]> {
    const now = new Date();
    return await db.select()
      .from(matches)
      .where(eq(matches.status, 'pending'))
      .orderBy(matches.matchDate);
  }

  async getCompletedMatches(): Promise<Match[]> {
    return await db.select()
      .from(matches)
      .where(eq(matches.status, 'completed'))
      .orderBy(matches.matchDate);
  }

  async createMatch(matchData: InsertMatch): Promise<Match> {
    try {
      // Préparation des données pour l'insertion
      const insertData = {
        team1Id: matchData.team1Id,
        team2Id: matchData.team2Id,
        matchDate: matchData.matchDate,
        status: matchData.status || 'pending',
        scoreTeam1: 0,
        scoreTeam2: 0
      };
      
      // Insertion du match et récupération des données générées
      const [newMatch] = await db.insert(matches).values(insertData).returning();
      return newMatch;
    } catch (error) {
      console.error("Erreur lors de la création du match:", error);
      throw error;
    }
  }

  async updateMatch(id: number, matchData: Partial<Match>): Promise<Match | undefined> {
    const match = await this.getMatch(id);
    if (!match) return undefined;
    
    const [updatedMatch] = await db.update(matches)
      .set(matchData)
      .where(eq(matches.id, id))
      .returning();
    
    // Update team points and matches played if match is completed
    if (updatedMatch.status === 'completed' && match.status !== 'completed') {
      await this.updateTeamStats(updatedMatch);
    }
    
    return updatedMatch;
  }

  async deleteMatch(id: number): Promise<boolean> {
    await db.delete(matches).where(eq(matches.id, id));
    return true;
  }

  // Statistics methods
  async getStatistics(id: number): Promise<Statistics | undefined> {
    const [stats] = await db.select().from(statistics).where(eq(statistics.id, id));
    return stats || undefined;
  }

  async getStatisticsByPlayerId(playerId: number): Promise<Statistics | undefined> {
    const [stats] = await db.select().from(statistics).where(eq(statistics.playerId, playerId));
    return stats || undefined;
  }

  async getAllStatistics(): Promise<Statistics[]> {
    return await db.select().from(statistics);
  }

  async createStatistics(statsData: InsertStatistics): Promise<Statistics> {
    try {
      // Préparation des données pour l'insertion
      const insertData = {
        playerId: statsData.playerId,
        goalsScored: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      };
      
      // Insertion des statistiques et récupération des données générées
      const [newStats] = await db.insert(statistics).values(insertData).returning();
      return newStats;
    } catch (error) {
      console.error("Erreur lors de la création des statistiques:", error);
      throw error;
    }
  }

  async updateStatistics(id: number, statsData: Partial<Statistics>): Promise<Statistics | undefined> {
    const stats = await this.getStatistics(id);
    if (!stats) return undefined;
    
    const [updatedStats] = await db.update(statistics)
      .set(statsData)
      .where(eq(statistics.id, id))
      .returning();
    
    return updatedStats;
  }

  // Helper methods
  private async updateTeamStats(match: Match): Promise<void> {
    const team1 = await this.getTeam(match.team1Id);
    const team2 = await this.getTeam(match.team2Id);
    
    if (team1) {
      let points = team1.points || 0;
      const scoreTeam1 = match.scoreTeam1 || 0;
      const scoreTeam2 = match.scoreTeam2 || 0;
      
      if (scoreTeam1 > scoreTeam2) {
        points += 3; // Win
      } else if (scoreTeam1 === scoreTeam2) {
        points += 1; // Draw
      }
      
      await this.updateTeam(team1.id, {
        points: points,
        matchesPlayed: (team1.matchesPlayed || 0) + 1
      });
    }
    
    if (team2) {
      let points = team2.points || 0;
      const scoreTeam1 = match.scoreTeam1 || 0;
      const scoreTeam2 = match.scoreTeam2 || 0;
      
      if (scoreTeam2 > scoreTeam1) {
        points += 3; // Win
      } else if (scoreTeam1 === scoreTeam2) {
        points += 1; // Draw
      }
      
      await this.updateTeam(team2.id, {
        points: points,
        matchesPlayed: (team2.matchesPlayed || 0) + 1
      });
    }
  }
}