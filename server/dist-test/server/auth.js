"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.authenticateToken = exports.verifyPassword = exports.generateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
// JWT Secret key (ideally should be in environment variables)
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
var TOKEN_EXPIRY = '24h';
// Generate JWT token for a user
var generateToken = function (user) {
    var payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};
exports.generateToken = generateToken;
// Verify password against hashed password
var verifyPassword = function (password, hashedPassword) {
    return bcrypt_1.default.compareSync(password, hashedPassword);
};
exports.verifyPassword = verifyPassword;
// Middleware to authenticate token
var authenticateToken = function (req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
// Middleware to check role permissions
var checkRole = function (roles) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
};
exports.checkRole = checkRole;
