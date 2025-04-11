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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.MemStorage = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var MemStorage = /** @class */ (function () {
    function MemStorage() {
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
            password: bcrypt_1.default.hashSync("admin123", 10),
            role: "superadmin",
        });
    }
    // User methods
    MemStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.users.get(id)];
            });
        });
    };
    MemStorage.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.users.values()).find(function (user) { return user.email === email; })];
            });
        });
    };
    MemStorage.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.users];
            });
        });
    };
    MemStorage.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user, stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = this.userIdCounter++;
                        // Hash password if it's not already hashed
                        if (!userData.password.startsWith('$2')) {
                            userData.password = bcrypt_1.default.hashSync(userData.password, 10);
                        }
                        user = __assign(__assign({}, userData), { id: id, statisticsId: null, dateRegistered: new Date(), role: userData.role || 'player', teamId: userData.teamId || null });
                        if (!(userData.role === 'player')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createStatistics({ playerId: id })];
                    case 1:
                        stats = _a.sent();
                        user.statisticsId = stats.id;
                        _a.label = 2;
                    case 2:
                        this.users.set(id, user);
                        return [2 /*return*/, user];
                }
            });
        });
    };
    MemStorage.prototype.updateUser = function (id, userData) {
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
                        updatedUser = __assign(__assign({}, user), userData);
                        this.users.set(id, updatedUser);
                        return [2 /*return*/, updatedUser];
                }
            });
        });
    };
    // Team methods
    MemStorage.prototype.getTeam = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.teams.get(id)];
            });
        });
    };
    MemStorage.prototype.getTeamByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.teams.values()).find(function (team) { return team.name === name; })];
            });
        });
    };
    MemStorage.prototype.getAllTeams = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.teams.values())];
            });
        });
    };
    MemStorage.prototype.createTeam = function (teamData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, team;
            return __generator(this, function (_a) {
                id = this.teamIdCounter++;
                team = __assign(__assign({}, teamData), { id: id, points: 0, matchesPlayed: 0, players: teamData.players || [], logo: teamData.logo || null, captainId: teamData.captainId || null });
                this.teams.set(id, team);
                return [2 /*return*/, team];
            });
        });
    };
    MemStorage.prototype.updateTeam = function (id, teamData) {
        return __awaiter(this, void 0, void 0, function () {
            var team, updatedTeam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTeam(id)];
                    case 1:
                        team = _a.sent();
                        if (!team)
                            return [2 /*return*/, undefined];
                        updatedTeam = __assign(__assign({}, team), teamData);
                        this.teams.set(id, updatedTeam);
                        return [2 /*return*/, updatedTeam];
                }
            });
        });
    };
    MemStorage.prototype.deleteTeam = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.teams.delete(id)];
            });
        });
    };
    // Match methods
    MemStorage.prototype.getMatch = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.matches.get(id)];
            });
        });
    };
    MemStorage.prototype.getAllMatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.matches.values())];
            });
        });
    };
    MemStorage.prototype.getLiveMatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.matches.values())
                        .filter(function (match) { return match.status === 'in_progress'; })
                        .sort(function (a, b) { return a.matchDate.getTime() - b.matchDate.getTime(); })];
            });
        });
    };
    MemStorage.prototype.getUpcomingMatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.matches.values())
                        .filter(function (match) { return match.status === 'pending'; })
                        .sort(function (a, b) { return a.matchDate.getTime() - b.matchDate.getTime(); })];
            });
        });
    };
    MemStorage.prototype.getCompletedMatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.matches.values())
                        .filter(function (match) { return match.status === 'completed'; })
                        .sort(function (a, b) { return b.matchDate.getTime() - a.matchDate.getTime(); })]; // Most recent first
            });
        });
    };
    MemStorage.prototype.createMatch = function (matchData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, match;
            return __generator(this, function (_a) {
                id = this.matchIdCounter++;
                match = __assign(__assign({}, matchData), { id: id, scoreTeam1: 0, scoreTeam2: 0, status: matchData.status || 'pending' // Assurer que le statut est défini
                 });
                this.matches.set(id, match);
                return [2 /*return*/, match];
            });
        });
    };
    MemStorage.prototype.updateMatch = function (id, matchData) {
        return __awaiter(this, void 0, void 0, function () {
            var match, updatedMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMatch(id)];
                    case 1:
                        match = _a.sent();
                        if (!match)
                            return [2 /*return*/, undefined];
                        updatedMatch = __assign(__assign({}, match), matchData);
                        this.matches.set(id, updatedMatch);
                        if (!(updatedMatch.status === 'completed' && match.status !== 'completed')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.updateTeamStats(updatedMatch)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, updatedMatch];
                }
            });
        });
    };
    MemStorage.prototype.deleteMatch = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.matches.delete(id)];
            });
        });
    };
    // Statistics methods
    MemStorage.prototype.getStatistics = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.statistics.get(id)];
            });
        });
    };
    MemStorage.prototype.getStatisticsByPlayerId = function (playerId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.statistics.values()).find(function (stat) { return stat.playerId === playerId; })];
            });
        });
    };
    MemStorage.prototype.getAllStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.statistics.values())];
            });
        });
    };
    MemStorage.prototype.createStatistics = function (statsData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, stats;
            return __generator(this, function (_a) {
                id = this.statisticsIdCounter++;
                stats = __assign(__assign({}, statsData), { id: id, goalsScored: 0, assists: 0, yellowCards: 0, redCards: 0 });
                this.statistics.set(id, stats);
                return [2 /*return*/, stats];
            });
        });
    };
    MemStorage.prototype.updateStatistics = function (id, statsData) {
        return __awaiter(this, void 0, void 0, function () {
            var stats, updatedStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStatistics(id)];
                    case 1:
                        stats = _a.sent();
                        if (!stats)
                            return [2 /*return*/, undefined];
                        updatedStats = __assign(__assign({}, stats), statsData);
                        this.statistics.set(id, updatedStats);
                        return [2 /*return*/, updatedStats];
                }
            });
        });
    };
    // Helper methods
    MemStorage.prototype.updateTeamStats = function (match) {
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
    return MemStorage;
}());
exports.MemStorage = MemStorage;
// Importer et utiliser la nouvelle implémentation DatabaseStorage
var databaseStorage_1 = require("./databaseStorage");
// Utiliser DatabaseStorage au lieu de MemStorage
exports.storage = new databaseStorage_1.DatabaseStorage();
