import { User, InsertUser, Team, InsertTeam, Match, InsertMatch, Statistics, InsertStatistics } from "@shared/schema";
import { users, teams, matches, statistics } from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, and, lt, gt } from "drizzle-orm";
import bcrypt from "bcrypt";

export class DatabaseStorage implements IStorage {
  private userIdCounter: number = 1;
  private teamIdCounter: number = 1;
  private matchIdCounter: number = 1;
  private statisticsIdCounter: number = 1;

  constructor() {
    // Initialiser les compteurs en vérifiant la base de données
    this.initCounters();
    // Créer un utilisateur super admin si aucun n'existe
    this.ensureSuperAdmin();
  }

  private async initCounters(): Promise<void> {
    try {
      // Obtenir le dernier ID pour chaque table
      const lastUser = await db.select().from(users).orderBy(users.id).limit(1);
      if (lastUser.length > 0) {
        this.userIdCounter = lastUser[0].id + 1;
      }

      const lastTeam = await db.select().from(teams).orderBy(teams.id).limit(1);
      if (lastTeam.length > 0) {
        this.teamIdCounter = lastTeam[0].id + 1;
      }

      const lastMatch = await db.select().from(matches).orderBy(matches.id).limit(1);
      if (lastMatch.length > 0) {
        this.matchIdCounter = lastMatch[0].id + 1;
      }

      const lastStat = await db.select().from(statistics).orderBy(statistics.id).limit(1);
      if (lastStat.length > 0) {
        this.statisticsIdCounter = lastStat[0].id + 1;
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des compteurs:", error);
    }
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

  getAllUsers(): Map<number, User> {
    const userMap = new Map<number, User>();
    db.select().from(users).then(userList => {
      userList.forEach(user => {
        userMap.set(user.id, user);
      });
    });
    return userMap;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Hash password if it's not already hashed
    if (!userData.password.startsWith('$2')) {
      userData.password = bcrypt.hashSync(userData.password, 10);
    }

    const id = this.userIdCounter++;
    const role = userData.role || 'player';
    const teamId = userData.teamId || null;
    
    const user: User = {
      ...userData,
      id,
      role,
      teamId,
      statisticsId: null,
      dateRegistered: new Date()
    };
    
    const [newUser] = await db.insert(users).values(user).returning();

    // Create initial statistics for player
    if (userData.role === 'player') {
      const stats = await this.createStatistics({ playerId: id });
      await db.update(users)
        .set({ statisticsId: stats.id })
        .where(eq(users.id, id));
      
      user.statisticsId = stats.id;
    }
    
    return user;
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
    const id = this.teamIdCounter++;
    
    const team: Team = {
      ...teamData,
      id,
      logo: teamData.logo || null,
      captainId: teamData.captainId || null,
      players: teamData.players || [],
      points: 0,
      matchesPlayed: 0
    };
    
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
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
    const id = this.matchIdCounter++;
    
    const match: Match = {
      ...matchData,
      id,
      scoreTeam1: 0,
      scoreTeam2: 0,
      status: matchData.status || 'pending'
    };
    
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
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
    const id = this.statisticsIdCounter++;
    
    const stats: Statistics = {
      ...statsData,
      id,
      goalsScored: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    };
    
    const [newStats] = await db.insert(statistics).values(stats).returning();
    return newStats;
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