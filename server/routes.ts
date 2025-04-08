import { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertUserSchema, insertTeamSchema, insertMatchSchema } from "@shared/schema";
import { generateToken, verifyPassword, authenticateToken, checkRole } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Create the new user
      const newUser = await storage.createUser(validatedData);
      
      // Generate JWT token
      const token = generateToken(newUser);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = newUser;
      
      return res.status(201).json({ 
        message: "User registered successfully",
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const isPasswordValid = verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({ 
        message: "Login successful",
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      return res.status(500).json({ message: "Login failed" });
    }
  });
  
  // User routes
  app.get("/api/user/profile", authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user profile" });
    }
  });
  
  // Get all users (for admin panel and team management)
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = Array.from(storage.getAllUsers().values()).map(user => {
        // Don't return the password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get users" });
    }
  });
  
  // Get user by ID
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user" });
    }
  });
  
  // Team routes
  app.get("/api/teams", async (req: Request, res: Response) => {
    try {
      const teams = await storage.getAllTeams();
      return res.status(200).json(teams);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get teams" });
    }
  });
  
  app.get("/api/teams/:id", async (req: Request, res: Response) => {
    try {
      const teamId = parseInt(req.params.id);
      const team = await storage.getTeam(teamId);
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      return res.status(200).json(team);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get team" });
    }
  });
  
  app.post("/api/teams", authenticateToken, async (req: Request, res: Response) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body);
      
      // Check if team already exists
      const existingTeam = await storage.getTeamByName(validatedData.name);
      if (existingTeam) {
        return res.status(400).json({ message: "Team already exists with this name" });
      }
      
      // Set current user as captain if not specified
      if (!validatedData.captainId) {
        validatedData.captainId = req.user!.id;
      }
      
      // Create the new team
      const newTeam = await storage.createTeam(validatedData);
      
      // If user is player, update their team ID
      if (req.user!.role === 'player') {
        await storage.updateUser(req.user!.id, { teamId: newTeam.id });
      }
      
      return res.status(201).json({ 
        message: "Team created successfully",
        team: newTeam
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create team" });
    }
  });
  
  app.put("/api/teams/:id", authenticateToken, checkRole(['admin', 'superadmin']), async (req: Request, res: Response) => {
    try {
      const teamId = parseInt(req.params.id);
      const team = await storage.getTeam(teamId);
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Only allow team captain or superadmin to update
      if (req.user!.role !== 'superadmin' && team.captainId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to update this team" });
      }
      
      // Update the team
      const updatedTeam = await storage.updateTeam(teamId, req.body);
      
      return res.status(200).json({ 
        message: "Team updated successfully",
        team: updatedTeam
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update team" });
    }
  });
  
  app.delete("/api/teams/:id", authenticateToken, checkRole(['superadmin']), async (req: Request, res: Response) => {
    try {
      const teamId = parseInt(req.params.id);
      const team = await storage.getTeam(teamId);
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Delete the team
      await storage.deleteTeam(teamId);
      
      return res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete team" });
    }
  });

  // Match routes
  app.get("/api/matches", async (req: Request, res: Response) => {
    try {
      const matches = await storage.getAllMatches();
      return res.status(200).json(matches);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get matches" });
    }
  });
  
  app.get("/api/matches/live", async (req: Request, res: Response) => {
    try {
      const liveMatches = await storage.getLiveMatches();
      return res.status(200).json(liveMatches);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get live matches" });
    }
  });
  
  app.get("/api/matches/upcoming", async (req: Request, res: Response) => {
    try {
      const upcomingMatches = await storage.getUpcomingMatches();
      return res.status(200).json(upcomingMatches);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get upcoming matches" });
    }
  });
  
  app.get("/api/matches/:id", async (req: Request, res: Response) => {
    try {
      const matchId = parseInt(req.params.id);
      const match = await storage.getMatch(matchId);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      return res.status(200).json(match);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get match" });
    }
  });
  
  app.post("/api/matches", authenticateToken, checkRole(['admin', 'superadmin']), async (req: Request, res: Response) => {
    try {
      const validatedData = insertMatchSchema.parse(req.body);
      
      // Check if both teams exist
      const team1 = await storage.getTeam(validatedData.team1Id);
      const team2 = await storage.getTeam(validatedData.team2Id);
      
      if (!team1 || !team2) {
        return res.status(400).json({ message: "One or both teams not found" });
      }
      
      // Create the new match
      const newMatch = await storage.createMatch(validatedData);
      
      return res.status(201).json({ 
        message: "Match created successfully",
        match: newMatch
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create match" });
    }
  });
  
  app.put("/api/matches/:id", authenticateToken, checkRole(['admin', 'superadmin']), async (req: Request, res: Response) => {
    try {
      const matchId = parseInt(req.params.id);
      const match = await storage.getMatch(matchId);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      // Update the match
      const updatedMatch = await storage.updateMatch(matchId, req.body);
      
      return res.status(200).json({ 
        message: "Match updated successfully",
        match: updatedMatch
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update match" });
    }
  });
  
  app.delete("/api/matches/:id", authenticateToken, checkRole(['superadmin']), async (req: Request, res: Response) => {
    try {
      const matchId = parseInt(req.params.id);
      const match = await storage.getMatch(matchId);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      // Delete the match
      await storage.deleteMatch(matchId);
      
      return res.status(200).json({ message: "Match deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete match" });
    }
  });
  
  // Statistics routes
  app.get("/api/statistics/:playerId", async (req: Request, res: Response) => {
    try {
      const playerId = parseInt(req.params.playerId);
      const stats = await storage.getStatisticsByPlayerId(playerId);
      
      if (!stats) {
        return res.status(404).json({ message: "Statistics not found for this player" });
      }
      
      return res.status(200).json(stats);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get player statistics" });
    }
  });
  
  app.put("/api/statistics/:id", authenticateToken, checkRole(['admin', 'superadmin']), async (req: Request, res: Response) => {
    try {
      const statsId = parseInt(req.params.id);
      const stats = await storage.getStatistics(statsId);
      
      if (!stats) {
        return res.status(404).json({ message: "Statistics not found" });
      }
      
      // Update the statistics
      const updatedStats = await storage.updateStatistics(statsId, req.body);
      
      return res.status(200).json({ 
        message: "Statistics updated successfully",
        statistics: updatedStats
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update statistics" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
