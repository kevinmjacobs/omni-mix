import sqlite3 from 'sqlite3';
const SQLITE3 = sqlite3.verbose();

const DB = new SQLITE3.Database('./db/omni_mix.db');

DB.serialize(() => {
  DB.run(
    `CREATE TABLE IF NOT EXISTS todo (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      todo TEXT NOT NULL,
      deleted INT2 DEFAULT 0 NOT NULL
    )`
  )
});