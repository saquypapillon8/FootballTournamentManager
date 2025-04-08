import { User, InsertUser, Team, InsertTeam, Match, InsertMatch, Statistics, InsertStatistics } from "@shared/schema";
import bcrypt from "bcrypt";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Team operations
  getTeam(id: number): Promise<Team | undefined>;
  getTeamByName(name: string): Promise<Team | undefined>;
  getAllTeams(): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, teamData: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<boolean>;
  
  // Match operations
  getMatch(id: number): Promise<Match | undefined>;
  getAllMatches(): Promise<Match[]>;
  getLiveMatches(): Promise<Match[]>;
  getUpcomingMatches(): Promise<Match[]>;
  getCompletedMatches(): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, matchData: Partial<Match>): Promise<Match | undefined>;
  deleteMatch(id: number): Promise<boolean>;
  
  // Statistics operations
  getStatistics(id: number): Promise<Statistics | undefined>;
  getStatisticsByPlayerId(playerId: number): Promise<Statistics | undefined>;
  getAllStatistics(): Promise<Statistics[]>;
  createStatistics(stats: InsertStatistics): Promise<Statistics>;
  updateStatistics(id: number, statsData: Partial<Statistics>): Promise<Statistics | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teams: Map<number, Team>;
  private matches: Map<number, Match>;
  private statistics: Map<number, Statistics>;
  private userIdCounter: number;
  private teamIdCounter: number;
  private matchIdCounter: number;
  private statisticsIdCounter: number;

  constructor() {
    this.users = new Map();
    this.teams = new Map();
    this.matches = new Map();
    this.statistics = new Map();
    this.userIdCounter = 1;
    this.teamIdCounter = 1;
    this.matchIdCounter = 1;
    this.statisticsIdCounter = 1;
    
    // Initialize with a super admin account
    this.createUser({
      name: "Admin",
      email: "admin@example.com",
      password: bcrypt.hashSync("admin123", 10),
      role: "superadmin",
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    
    // Hash password if it's not already hashed
    if (!userData.password.startsWith('$2')) {
      userData.password = bcrypt.hashSync(userData.password, 10);
    }
    
    const user: User = { ...userData, id, statisticsId: null, dateRegistered: new Date() };
    
    // Create initial statistics for player
    if (userData.role === 'player') {
      const stats = await this.createStatistics({ playerId: id });
      user.statisticsId = stats.id;
    }
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    // Hash password if it's being updated and not already hashed
    if (userData.password && !userData.password.startsWith('$2')) {
      userData.password = bcrypt.hashSync(userData.password, 10);
    }
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Team methods
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeamByName(name: string): Promise<Team | undefined> {
    return Array.from(this.teams.values()).find(team => team.name === name);
  }

  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async createTeam(teamData: InsertTeam): Promise<Team> {
    const id = this.teamIdCounter++;
    const team: Team = { 
      ...teamData, 
      id, 
      points: 0, 
      matchesPlayed: 0,
      players: teamData.players || []
    };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: number, teamData: Partial<Team>): Promise<Team | undefined> {
    const team = await this.getTeam(id);
    if (!team) return undefined;
    
    const updatedTeam = { ...team, ...teamData };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<boolean> {
    return this.teams.delete(id);
  }

  // Match methods
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getAllMatches(): Promise<Match[]> {
    return Array.from(this.matches.values());
  }

  async getLiveMatches(): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter(match => match.status === 'in_progress')
      .sort((a, b) => a.matchDate.getTime() - b.matchDate.getTime());
  }

  async getUpcomingMatches(): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter(match => match.status === 'pending')
      .sort((a, b) => a.matchDate.getTime() - b.matchDate.getTime());
  }

  async getCompletedMatches(): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter(match => match.status === 'completed')
      .sort((a, b) => b.matchDate.getTime() - a.matchDate.getTime()); // Most recent first
  }

  async createMatch(matchData: InsertMatch): Promise<Match> {
    const id = this.matchIdCounter++;
    const match: Match = { 
      ...matchData, 
      id, 
      scoreTeam1: 0, 
      scoreTeam2: 0
    };
    this.matches.set(id, match);
    return match;
  }

  async updateMatch(id: number, matchData: Partial<Match>): Promise<Match | undefined> {
    const match = await this.getMatch(id);
    if (!match) return undefined;
    
    const updatedMatch = { ...match, ...matchData };
    this.matches.set(id, updatedMatch);
    
    // Update team points and matches played if match is completed
    if (updatedMatch.status === 'completed' && match.status !== 'completed') {
      await this.updateTeamStats(updatedMatch);
    }
    
    return updatedMatch;
  }

  async deleteMatch(id: number): Promise<boolean> {
    return this.matches.delete(id);
  }

  // Statistics methods
  async getStatistics(id: number): Promise<Statistics | undefined> {
    return this.statistics.get(id);
  }

  async getStatisticsByPlayerId(playerId: number): Promise<Statistics | undefined> {
    return Array.from(this.statistics.values()).find(stat => stat.playerId === playerId);
  }

  async getAllStatistics(): Promise<Statistics[]> {
    return Array.from(this.statistics.values());
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
    this.statistics.set(id, stats);
    return stats;
  }

  async updateStatistics(id: number, statsData: Partial<Statistics>): Promise<Statistics | undefined> {
    const stats = await this.getStatistics(id);
    if (!stats) return undefined;
    
    const updatedStats = { ...stats, ...statsData };
    this.statistics.set(id, updatedStats);
    return updatedStats;
  }

  // Helper methods
  private async updateTeamStats(match: Match): Promise<void> {
    const team1 = await this.getTeam(match.team1Id);
    const team2 = await this.getTeam(match.team2Id);
    
    if (team1) {
      let points = team1.points;
      if (match.scoreTeam1 > match.scoreTeam2) {
        points += 3; // Win
      } else if (match.scoreTeam1 === match.scoreTeam2) {
        points += 1; // Draw
      }
      
      await this.updateTeam(team1.id, {
        points: points,
        matchesPlayed: team1.matchesPlayed + 1
      });
    }
    
    if (team2) {
      let points = team2.points;
      if (match.scoreTeam2 > match.scoreTeam1) {
        points += 3; // Win
      } else if (match.scoreTeam1 === match.scoreTeam2) {
        points += 1; // Draw
      }
      
      await this.updateTeam(team2.id, {
        points: points,
        matchesPlayed: team2.matchesPlayed + 1
      });
    }
  }
}

export const storage = new MemStorage();
