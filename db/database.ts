import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();

const initializeDB = () => {
  return new sqlite.Database('./db/omni_mix.db');
};

const db = initializeDB();

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      email TEXT NOT NULL,
      hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      access_code TEXT,
      state TEXT,
      deleted INT2 DEFAULT 0 NOT NULL
    )`
  );
  db.close((err) => {
    if (err) {
      console.log(err);
      throw err;
    }
  });
});

export default initializeDB;