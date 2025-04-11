"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
var http_1 = require("http");
var storage_1 = require("./storage");
var schema_1 = require("@shared/schema");
var auth_1 = require("./auth");
var zod_1 = require("zod");
function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            // Auth routes
            app.post("/api/auth/register", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, existingUser, newUser, token, password, userWithoutPassword, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            validatedData = schema_1.insertUserSchema.parse(req.body);
                            return [4 /*yield*/, storage_1.storage.getUserByEmail(validatedData.email)];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser) {
                                return [2 /*return*/, res.status(400).json({ message: "User already exists with this email" })];
                            }
                            return [4 /*yield*/, storage_1.storage.createUser(validatedData)];
                        case 2:
                            newUser = _a.sent();
                            token = (0, auth_1.generateToken)(newUser);
                            password = newUser.password, userWithoutPassword = __rest(newUser, ["password"]);
                            return [2 /*return*/, res.status(201).json({
                                    message: "User registered successfully",
                                    user: __assign(__assign({}, userWithoutPassword), { id: newUser.id // Assurez-vous que l'ID est inclus explicitement
                                     }),
                                    token: token
                                })];
                        case 3:
                            error_1 = _a.sent();
                            if (error_1 instanceof zod_1.z.ZodError) {
                                return [2 /*return*/, res.status(400).json({ message: "Validation error", errors: error_1.errors })];
                            }
                            return [2 /*return*/, res.status(500).json({ message: "Failed to register user" })];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/auth/login", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, email, password, user, isPasswordValid, token, _, userWithoutPassword, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = schema_1.loginSchema.parse(req.body), email = _a.email, password = _a.password;
                            return [4 /*yield*/, storage_1.storage.getUserByEmail(email)];
                        case 1:
                            user = _b.sent();
                            if (!user) {
                                return [2 /*return*/, res.status(401).json({ message: "Invalid email or password" })];
                            }
                            isPasswordValid = (0, auth_1.verifyPassword)(password, user.password);
                            if (!isPasswordValid) {
                                return [2 /*return*/, res.status(401).json({ message: "Invalid email or password" })];
                            }
                            token = (0, auth_1.generateToken)(user);
                            _ = user.password, userWithoutPassword = __rest(user, ["password"]);
                            return [2 /*return*/, res.status(200).json({
                                    message: "Login successful",
                                    user: __assign(__assign({}, userWithoutPassword), { id: user.id // Assurez-vous que l'ID est inclus explicitement
                                     }),
                                    token: token
                                })];
                        case 2:
                            error_2 = _b.sent();
                            if (error_2 instanceof zod_1.z.ZodError) {
                                return [2 /*return*/, res.status(400).json({ message: "Validation error", errors: error_2.errors })];
                            }
                            return [2 /*return*/, res.status(500).json({ message: "Login failed" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // User routes
            app.get("/api/user/profile", auth_1.authenticateToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var user, password, userWithoutPassword, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getUser(req.user.id)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                            }
                            password = user.password, userWithoutPassword = __rest(user, ["password"]);
                            return [2 /*return*/, res.status(200).json(userWithoutPassword)];
                        case 2:
                            error_3 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get user profile" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get all users (for admin panel and team management)
            app.get("/api/users", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userMap, users, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getAllUsers()];
                        case 1:
                            userMap = _a.sent();
                            users = Array.from(userMap.values()).map(function (user) {
                                if (user && typeof user === 'object' && 'password' in user) {
                                    // Ne pas renvoyer le mot de passe
                                    var _a = user, password = _a.password, userWithoutPassword = __rest(_a, ["password"]);
                                    return userWithoutPassword;
                                }
                                return user;
                            });
                            return [2 /*return*/, res.status(200).json(users)];
                        case 2:
                            error_4 = _a.sent();
                            console.error("Erreur lors de la récupération des utilisateurs:", error_4);
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get users" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get user by ID
            app.get("/api/users/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, user, password, userWithoutPassword, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            userId = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getUser(userId)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                            }
                            password = user.password, userWithoutPassword = __rest(user, ["password"]);
                            return [2 /*return*/, res.status(200).json(userWithoutPassword)];
                        case 2:
                            error_5 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get user" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Team routes
            app.get("/api/teams", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var teams, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getAllTeams()];
                        case 1:
                            teams = _a.sent();
                            return [2 /*return*/, res.status(200).json(teams)];
                        case 2:
                            error_6 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get teams" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/teams/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var teamId, team, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            teamId = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getTeam(teamId)];
                        case 1:
                            team = _a.sent();
                            if (!team) {
                                return [2 /*return*/, res.status(404).json({ message: "Team not found" })];
                            }
                            return [2 /*return*/, res.status(200).json(team)];
                        case 2:
                            error_7 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get team" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/teams", auth_1.authenticateToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, existingTeam, newTeam, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            validatedData = schema_1.insertTeamSchema.parse(req.body);
                            return [4 /*yield*/, storage_1.storage.getTeamByName(validatedData.name)];
                        case 1:
                            existingTeam = _a.sent();
                            if (existingTeam) {
                                return [2 /*return*/, res.status(400).json({ message: "Team already exists with this name" })];
                            }
                            // Set current user as captain if not specified
                            if (!validatedData.captainId) {
                                validatedData.captainId = req.user.id;
                            }
                            return [4 /*yield*/, storage_1.storage.createTeam(validatedData)];
                        case 2:
                            newTeam = _a.sent();
                            if (!(req.user.role === 'player')) return [3 /*break*/, 4];
                            return [4 /*yield*/, storage_1.storage.updateUser(req.user.id, { teamId: newTeam.id })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, res.status(201).json({
                                message: "Team created successfully",
                                team: newTeam
                            })];
                        case 5:
                            error_8 = _a.sent();
                            if (error_8 instanceof zod_1.z.ZodError) {
                                return [2 /*return*/, res.status(400).json({ message: "Validation error", errors: error_8.errors })];
                            }
                            return [2 /*return*/, res.status(500).json({ message: "Failed to create team" })];
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            app.put("/api/teams/:id", auth_1.authenticateToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var teamId_1, team, playerId, teamMembers, teamMemberCount, player, updatedTeam, updatedTeam, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 9, , 10]);
                            teamId_1 = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getTeam(teamId_1)];
                        case 1:
                            team = _a.sent();
                            if (!team) {
                                return [2 /*return*/, res.status(404).json({ message: "Team not found" })];
                            }
                            // Only allow team captain or superadmin to update
                            if (req.user.role !== 'superadmin' && team.captainId !== req.user.id) {
                                return [2 /*return*/, res.status(403).json({ message: "Not authorized to update this team" })];
                            }
                            if (!req.body.playerId) return [3 /*break*/, 6];
                            playerId = parseInt(req.body.playerId);
                            return [4 /*yield*/, storage_1.storage.getAllUsers()];
                        case 2:
                            teamMembers = _a.sent();
                            teamMemberCount = Array.from(teamMembers.values()).filter(function (user) { return user.teamId === teamId_1; }).length;
                            if (teamMemberCount >= 8) {
                                return [2 /*return*/, res.status(400).json({ message: "L'équipe a déjà atteint le maximum de 8 joueurs" })];
                            }
                            return [4 /*yield*/, storage_1.storage.getUser(playerId)];
                        case 3:
                            player = _a.sent();
                            if (!player) {
                                return [2 /*return*/, res.status(404).json({ message: "Joueur non trouvé" })];
                            }
                            if (player.teamId !== null) {
                                return [2 /*return*/, res.status(400).json({ message: "Ce joueur fait déjà partie d'une équipe" })];
                            }
                            // Ajouter le joueur à l'équipe
                            return [4 /*yield*/, storage_1.storage.updateUser(playerId, { teamId: teamId_1 })];
                        case 4:
                            // Ajouter le joueur à l'équipe
                            _a.sent();
                            return [4 /*yield*/, storage_1.storage.getTeam(teamId_1)];
                        case 5:
                            updatedTeam = _a.sent();
                            return [2 /*return*/, res.status(200).json({
                                    message: "Joueur ajouté à l'équipe avec succès",
                                    team: updatedTeam
                                })];
                        case 6: return [4 /*yield*/, storage_1.storage.updateTeam(teamId_1, req.body)];
                        case 7:
                            updatedTeam = _a.sent();
                            return [2 /*return*/, res.status(200).json({
                                    message: "Team updated successfully",
                                    team: updatedTeam
                                })];
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            error_9 = _a.sent();
                            console.error("Erreur lors de la mise à jour de l'équipe:", error_9);
                            return [2 /*return*/, res.status(500).json({ message: "Failed to update team" })];
                        case 10: return [2 /*return*/];
                    }
                });
            }); });
            app.delete("/api/teams/:id", auth_1.authenticateToken, (0, auth_1.checkRole)(['superadmin']), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var teamId, team, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            teamId = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getTeam(teamId)];
                        case 1:
                            team = _a.sent();
                            if (!team) {
                                return [2 /*return*/, res.status(404).json({ message: "Team not found" })];
                            }
                            // Delete the team
                            return [4 /*yield*/, storage_1.storage.deleteTeam(teamId)];
                        case 2:
                            // Delete the team
                            _a.sent();
                            return [2 /*return*/, res.status(200).json({ message: "Team deleted successfully" })];
                        case 3:
                            error_10 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to delete team" })];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Match routes
            app.get("/api/matches", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var matches, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getAllMatches()];
                        case 1:
                            matches = _a.sent();
                            return [2 /*return*/, res.status(200).json(matches)];
                        case 2:
                            error_11 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get matches" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/matches/live", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var liveMatches, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getLiveMatches()];
                        case 1:
                            liveMatches = _a.sent();
                            return [2 /*return*/, res.status(200).json(liveMatches)];
                        case 2:
                            error_12 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get live matches" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/matches/upcoming", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var upcomingMatches, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getUpcomingMatches()];
                        case 1:
                            upcomingMatches = _a.sent();
                            return [2 /*return*/, res.status(200).json(upcomingMatches)];
                        case 2:
                            error_13 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get upcoming matches" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/matches/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var matchId, match, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            matchId = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getMatch(matchId)];
                        case 1:
                            match = _a.sent();
                            if (!match) {
                                return [2 /*return*/, res.status(404).json({ message: "Match not found" })];
                            }
                            return [2 /*return*/, res.status(200).json(match)];
                        case 2:
                            error_14 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get match" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/matches", auth_1.authenticateToken, (0, auth_1.checkRole)(['admin', 'superadmin']), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, team1, team2, newMatch, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            validatedData = schema_1.insertMatchSchema.parse(req.body);
                            return [4 /*yield*/, storage_1.storage.getTeam(validatedData.team1Id)];
                        case 1:
                            team1 = _a.sent();
                            return [4 /*yield*/, storage_1.storage.getTeam(validatedData.team2Id)];
                        case 2:
                            team2 = _a.sent();
                            if (!team1 || !team2) {
                                return [2 /*return*/, res.status(400).json({ message: "One or both teams not found" })];
                            }
                            return [4 /*yield*/, storage_1.storage.createMatch(validatedData)];
                        case 3:
                            newMatch = _a.sent();
                            return [2 /*return*/, res.status(201).json({
                                    message: "Match created successfully",
                                    match: newMatch
                                })];
                        case 4:
                            error_15 = _a.sent();
                            if (error_15 instanceof zod_1.z.ZodError) {
                                return [2 /*return*/, res.status(400).json({ message: "Validation error", errors: error_15.errors })];
                            }
                            return [2 /*return*/, res.status(500).json({ message: "Failed to create match" })];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            app.put("/api/matches/:id", auth_1.authenticateToken, (0, auth_1.checkRole)(['admin', 'superadmin']), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var matchId, match, updatedMatch, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            matchId = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getMatch(matchId)];
                        case 1:
                            match = _a.sent();
                            if (!match) {
                                return [2 /*return*/, res.status(404).json({ message: "Match not found" })];
                            }
                            return [4 /*yield*/, storage_1.storage.updateMatch(matchId, req.body)];
                        case 2:
                            updatedMatch = _a.sent();
                            return [2 /*return*/, res.status(200).json({
                                    message: "Match updated successfully",
                                    match: updatedMatch
                                })];
                        case 3:
                            error_16 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to update match" })];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.delete("/api/matches/:id", auth_1.authenticateToken, (0, auth_1.checkRole)(['superadmin']), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var matchId, match, error_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            matchId = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getMatch(matchId)];
                        case 1:
                            match = _a.sent();
                            if (!match) {
                                return [2 /*return*/, res.status(404).json({ message: "Match not found" })];
                            }
                            // Delete the match
                            return [4 /*yield*/, storage_1.storage.deleteMatch(matchId)];
                        case 2:
                            // Delete the match
                            _a.sent();
                            return [2 /*return*/, res.status(200).json({ message: "Match deleted successfully" })];
                        case 3:
                            error_17 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to delete match" })];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Statistics routes
            app.get("/api/statistics", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var allStats, error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getAllStatistics()];
                        case 1:
                            allStats = _a.sent();
                            return [2 /*return*/, res.status(200).json(allStats)];
                        case 2:
                            error_18 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get all player statistics" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/statistics/:playerId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var playerId, stats, error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            playerId = parseInt(req.params.playerId);
                            return [4 /*yield*/, storage_1.storage.getStatisticsByPlayerId(playerId)];
                        case 1:
                            stats = _a.sent();
                            if (!stats) {
                                return [2 /*return*/, res.status(404).json({ message: "Statistics not found for this player" })];
                            }
                            return [2 /*return*/, res.status(200).json(stats)];
                        case 2:
                            error_19 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to get player statistics" })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.put("/api/statistics/:id", auth_1.authenticateToken, (0, auth_1.checkRole)(['admin', 'superadmin']), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var statsId, stats, updatedStats, error_20;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            statsId = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getStatistics(statsId)];
                        case 1:
                            stats = _a.sent();
                            if (!stats) {
                                return [2 /*return*/, res.status(404).json({ message: "Statistics not found" })];
                            }
                            return [4 /*yield*/, storage_1.storage.updateStatistics(statsId, req.body)];
                        case 2:
                            updatedStats = _a.sent();
                            return [2 /*return*/, res.status(200).json({
                                    message: "Statistics updated successfully",
                                    statistics: updatedStats
                                })];
                        case 3:
                            error_20 = _a.sent();
                            return [2 /*return*/, res.status(500).json({ message: "Failed to update statistics" })];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            httpServer = (0, http_1.createServer)(app);
            return [2 /*return*/, httpServer];
        });
    });
}
