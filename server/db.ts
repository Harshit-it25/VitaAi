import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../chat.db");
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    sender TEXT NOT NULL,
    intent TEXT,
    topic TEXT,
    language TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface DBMessage {
  id: string;
  text: string;
  sender: string;
  intent?: string;
  topic?: string;
  language?: string;
  timestamp?: string;
}

export const chatDb = {
  saveMessage: (msg: DBMessage) => {
    const stmt = db.prepare(`
      INSERT INTO messages (id, text, sender, intent, topic, language)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(msg.id, msg.text, msg.sender, msg.intent || null, msg.topic || null, msg.language || null);
  },

  getHistory: (limit = 50): DBMessage[] => {
    const stmt = db.prepare(`
      SELECT * FROM messages ORDER BY timestamp ASC LIMIT ?
    `);
    return stmt.all(limit) as DBMessage[];
  },

  clearHistory: () => {
    db.prepare("DELETE FROM messages").run();
  }
};
