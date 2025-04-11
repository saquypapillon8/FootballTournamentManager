"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseStorage = void 0;
var schema_1 = require("@shared/schema");
var db_1 = require("./db");
var drizzle_orm_1 = require("drizzle-orm");
var bcrypt_1 = __importDefault(require("bcrypt"));
// Fonction pour générer un ID à 6 chiffres aléatoire
function generateSixDigitId() {
    return __awaiter(this, void 0, void 0, function () {
        var min, max, randomId, existingUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    min = 100000;
                    max = 999999;
                    randomId = Math.floor(Math.random() * (max - min + 1)) + min;
                    return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, randomId))];
                case 1:
                    existingUser = (_a.sent())[0];
                    if (existingUser) {
                        // Si l'ID existe déjà, génère un nouveau
                        return [2 /*return*/, generateSixDigitId()];
                    }
                    return [2 /*return*/, randomId];
            }
        });
    });
}
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
        // Créer un utilisateur super admin si aucun n'existe
        this.ensureSuperAdmin();
    }
    DatabaseStorage.prototype.ensureSuperAdmin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var superAdmin, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.role, "superadmin")).limit(1)];
                    case 1:
                        superAdmin = _a.sent();
                        if (!(superAdmin.length === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createUser({
                                name: "Admin",
                                email: "admin@example.com",
                                password: bcrypt_1.default.hashSync("admin123", 10),
                                role: "superadmin",
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Erreur lors de la création du super admin:", error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // User methods
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userList, userMap_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.users)];
                    case 1:
                        userList = _a.sent();
                        userMap_1 = new Map();
                        userList.forEach(function (user) {
                            userMap_1.set(user.id, user);
                        });
                        return [2 /*return*/, userMap_1];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Erreur lors de la récupération des utilisateurs:", error_2);
                        return [2 /*return*/, new Map()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, insertData, newUser, stats, updatedUser, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        // Hash password if it's not already hashed
                        if (!userData.password.startsWith('$2')) {
                            userData.password = bcrypt_1.default.hashSync(userData.password, 10);
                        }
                        return [4 /*yield*/, generateSixDigitId()];
                    case 1:
                        userId = _a.sent();
                        insertData = {
                            id: userId,
                            name: userData.name,
                            email: userData.email,
                            password: userData.password,
                            role: userData.role || 'player',
                            teamId: userData.teamId || null,
                            dateRegistered: new Date() // Assurons-nous que la date est définie
                        };
                        return [4 /*yield*/, db_1.db.insert(schema_1.users).values(insertData).returning()];
                    case 2:
                        newUser = (_a.sent())[0];
                        if (!(newUser.role === 'player')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.createStatistics({ playerId: newUser.id })];
                    case 3:
                        stats = _a.sent();
                        return [4 /*yield*/, db_1.db.update(schema_1.users)
                                .set({ statisticsId: stats.id })
                                .where((0, drizzle_orm_1.eq)(schema_1.users.id, newUser.id))
                                .returning()];
                    case 4:
                        updatedUser = (_a.sent())[0];
                        return [2 /*return*/, updatedUser];
                    case 5: return [2 /*return*/, newUser];
                    case 6:
                        error_3 = _a.sent();
                        console.error("Erreur lors de la création de l'utilisateur:", error_3);
                        throw error_3;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateUser = function (id, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var user, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUser(id)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, undefined];
                        // Hash password if it's being updated and not already hashed
                        if (userData.password && !userData.password.startsWith('$2')) {
                            userData.password = bcrypt_1.default.hashSync(userData.password, 10);
                        }
                        return [4 /*yield*/, db_1.db.update(schema_1.users)
                                .set(userData)
                                .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
                                .returning()];
                    case 2:
                        updatedUser = (_a.sent())[0];
                        return [2 /*return*/, updatedUser];
                }
            });
        });
    };
    // Team methods
    DatabaseStorage.prototype.getTeam = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var team;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.teams).where((0, drizzle_orm_1.eq)(schema_1.teams.id, id))];
                    case 1:
                        team = (_a.sent())[0];
                        return [2 /*return*/, team || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTeamByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var team;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.teams).where((0, drizzle_orm_1.eq)(schema_1.teams.name, name))];
                    case 1:
                        team = (_a.sent())[0];
                        return [2 /*return*/, team || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllTeams = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.teams)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createTeam = function (teamData) {
        return __awaiter(this, void 0, void 0, function () {
            var insertData, newTeam, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        insertData = {
                            name: teamData.name,
                            logo: teamData.logo || null,
                            captainId: teamData.captainId || null,
                            players: teamData.players || [],
                            points: 0,
                            matchesPlayed: 0
                        };
                        return [4 /*yield*/, db_1.db.insert(schema_1.teams).values(insertData).returning()];
                    case 1:
                        newTeam = (_a.sent())[0];
                        return [2 /*return*/, newTeam];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Erreur lors de la création de l'équipe:", error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateTeam = function (id, teamData) {
        return __awaiter(this, void 0, void 0, function () {
            var team, updatedTeam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTeam(id)];
                    case 1:
                        team = _a.sent();
                        if (!team)
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, db_1.db.update(schema_1.teams)
                                .set(teamData)
                                .where((0, drizzle_orm_1.eq)(schema_1.teams.id, id))
                                .returning()];
                    case 2:
                        updatedTeam = (_a.sent())[0];
                        return [2 /*return*/, updatedTeam];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteTeam = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.delete(schema_1.teams).where((0, drizzle_orm_1.eq)(schema_1.teams.id, id))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, true]; // Si aucune erreur n'est produite, la suppression est réussie
                }
            });
        });
    };
    // Match methods
    DatabaseStorage.prototype.getMatch = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var match;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.matches).where((0, drizzle_orm_1.eq)(schema_1.matches.id, id))];
                    case 1:
                        match = (_a.sent())[0];
                        return [2 /*return*/, match || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllMatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.matches)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getLiveMatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select()
                            .from(schema_1.matches)
                            .where((0, drizzle_orm_1.eq)(schema_1.matches.status, 'in_progress'))
                            .orderBy(schema_1.matches.matchDate)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUpcomingMatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        return [4 /*yield*/, db_1.db.select()
                                .from(schema_1.matches)
                                .where((0, drizzle_orm_1.eq)(schema_1.matches.status, 'pending'))
                                .orderBy(schema_1.matches.matchDate)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getCompletedMatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select()
                            .from(schema_1.matches)
                            .where((0, drizzle_orm_1.eq)(schema_1.matches.status, 'completed'))
                            .orderBy(schema_1.matches.matchDate)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createMatch = function (matchData) {
        return __awaiter(this, void 0, void 0, function () {
            var insertData, newMatch, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        insertData = {
                            team1Id: matchData.team1Id,
                            team2Id: matchData.team2Id,
                            matchDate: matchData.matchDate,
                            status: matchData.status || 'pending',
                            scoreTeam1: 0,
                            scoreTeam2: 0
                        };
                        return [4 /*yield*/, db_1.db.insert(schema_1.matches).values(insertData).returning()];
                    case 1:
                        newMatch = (_a.sent())[0];
                        return [2 /*return*/, newMatch];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Erreur lors de la création du match:", error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateMatch = function (id, matchData) {
        return __awaiter(this, void 0, void 0, function () {
            var match, updatedMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMatch(id)];
                    case 1:
                        match = _a.sent();
                        if (!match)
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, db_1.db.update(schema_1.matches)
                                .set(matchData)
                                .where((0, drizzle_orm_1.eq)(schema_1.matches.id, id))
                                .returning()];
                    case 2:
                        updatedMatch = (_a.sent())[0];
                        if (!(updatedMatch.status === 'completed' && match.status !== 'completed')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.updateTeamStats(updatedMatch)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, updatedMatch];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteMatch = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.delete(schema_1.matches).where((0, drizzle_orm_1.eq)(schema_1.matches.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    // Statistics methods
    DatabaseStorage.prototype.getStatistics = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.statistics).where((0, drizzle_orm_1.eq)(schema_1.statistics.id, id))];
                    case 1:
                        stats = (_a.sent())[0];
                        return [2 /*return*/, stats || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getStatisticsByPlayerId = function (playerId) {
        return __awaiter(this, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.statistics).where((0, drizzle_orm_1.eq)(schema_1.statistics.playerId, playerId))];
                    case 1:
                        stats = (_a.sent())[0];
                        return [2 /*return*/, stats || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.statistics)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createStatistics = function (statsData) {
        return __awaiter(this, void 0, void 0, function () {
            var insertData, newStats, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        insertData = {
                            playerId: statsData.playerId,
                            goalsScored: 0,
                            assists: 0,
                            yellowCards: 0,
                            redCards: 0
                        };
                        return [4 /*yield*/, db_1.db.insert(schema_1.statistics).values(insertData).returning()];
                    case 1:
                        newStats = (_a.sent())[0];
                        return [2 /*return*/, newStats];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Erreur lors de la création des statistiques:", error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateStatistics = function (id, statsData) {
        return __awaiter(this, void 0, void 0, function () {
            var stats, updatedStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStatistics(id)];
                    case 1:
                        stats = _a.sent();
                        if (!stats)
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, db_1.db.update(schema_1.statistics)
                                .set(statsData)
                                .where((0, drizzle_orm_1.eq)(schema_1.statistics.id, id))
                                .returning()];
                    case 2:
                        updatedStats = (_a.sent())[0];
                        return [2 /*return*/, updatedStats];
                }
            });
        });
    };
    // Helper methods
    DatabaseStorage.prototype.updateTeamStats = function (match) {
        return __awaiter(this, void 0, void 0, function () {
            var team1, team2, points, scoreTeam1, scoreTeam2, points, scoreTeam1, scoreTeam2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTeam(match.team1Id)];
                    case 1:
                        team1 = _a.sent();
                        return [4 /*yield*/, this.getTeam(match.team2Id)];
                    case 2:
                        team2 = _a.sent();
                        if (!team1) return [3 /*break*/, 4];
                        points = team1.points || 0;
                        scoreTeam1 = match.scoreTeam1 || 0;
                        scoreTeam2 = match.scoreTeam2 || 0;
                        if (scoreTeam1 > scoreTeam2) {
                            points += 3; // Win
                        }
                        else if (scoreTeam1 === scoreTeam2) {
                            points += 1; // Draw
                        }
                        return [4 /*yield*/, this.updateTeam(team1.id, {
                                points: points,
                                matchesPlayed: (team1.matchesPlayed || 0) + 1
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!team2) return [3 /*break*/, 6];
                        points = team2.points || 0;
                        scoreTeam1 = match.scoreTeam1 || 0;
                        scoreTeam2 = match.scoreTeam2 || 0;
                        if (scoreTeam2 > scoreTeam1) {
                            points += 3; // Win
                        }
                        else if (scoreTeam1 === scoreTeam2) {
                            points += 1; // Draw
                        }
                        return [4 /*yield*/, this.updateTeam(team2.id, {
                                points: points,
                                matchesPlayed: (team2.matchesPlayed || 0) + 1
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return DatabaseStorage;
}());
exports.DatabaseStorage = DatabaseStorage;
