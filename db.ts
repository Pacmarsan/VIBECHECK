import Database from 'better-sqlite3';
import path from 'path';

// Create or open the SQLite database
// Vercel serverless functions have a read-only filesystem, except for /tmp
const dbPath = process.env.VERCEL ? '/tmp/vibecheck.db' : 'vibecheck.db';
const db = new Database(dbPath, { verbose: console.log });

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS vibes (
    id TEXT PRIMARY KEY,
    userId TEXT,
    vibeLabel TEXT,
    pulseCount INTEGER,
    growthPercentage TEXT,
    realVoices TEXT,
    aiRemix TEXT,
    supportMessage TEXT,
    originalInput TEXT,
    musicRecommendations TEXT,
    likes INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reactions (
    vibeId TEXT,
    userId TEXT,
    reactionType TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (vibeId, userId, reactionType)
  );
`);

// Safely append new column for existing DBs
try {
  db.exec('ALTER TABLE vibes ADD COLUMN musicRecommendations TEXT');
} catch (error: any) {
  // column already exists, safely ignore
}

// Safely append new column for existing DBs
try {
  db.exec('ALTER TABLE vibes ADD COLUMN supportMessage TEXT');
} catch (error: any) {
  // column already exists, safely ignore
}

// Safely append new column for existing DBs
try {
  db.exec('ALTER TABLE vibes ADD COLUMN likes INTEGER DEFAULT 0');
} catch (error: any) {
  // column already exists, safely ignore
}

export default db;
