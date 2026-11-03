const path = require('node:path');
const Database = require('better-sqlite3');
const { databasePath, seed } = require('./data/seed');

const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
seed(db);

module.exports = { db };
