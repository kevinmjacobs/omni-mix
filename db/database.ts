import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();

const db = new sqlite.Database('./db/omni_mix.db');

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS todo (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      todo TEXT NOT NULL,
      deleted INT2 DEFAULT 0 NOT NULL
    )`
  )
});

export default db;