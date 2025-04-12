"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var postgres_js_1 = require("drizzle-orm/postgres-js");
var postgres_1 = require("postgres");
var connectionString = "postgresql://postgres:saquy0000@localhost:5432/foottournoi";
var client = (0, postgres_1.default)(connectionString);
exports.db = (0, postgres_js_1.drizzle)(client);
