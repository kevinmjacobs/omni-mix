import express from 'express';
import sqlite3 from 'sqlite3';
const SQLITE3 = sqlite3.verbose();

const ROUTER = express.Router();

ROUTER.get('/', (req, res, next) => {
  let db = new SQLITE3.Database('./db/omni_mix.db', (err) => {
    if (err) {
      res.render('error', { error: err });
    }
      console.log("Connected to the database.");
    }
  );

  db.serialize(async () => {
    db.all('SELECT * FROM todo WHERE deleted = 0;', (err, rows) => {
      if (err) {
        res.render('error', { error: err });
      }

      db.close((err) => {
        if (err) {
          res.render('error', { error: err });
        }
        console.log('Close the database connection');
        res.render('index', { data: rows });
      });
    });
  });
});

ROUTER.post("/", (req, res) => {
  let db = new SQLITE3.Database('./db/omni_mix.db', (err) => {
    if (err) {
      res.render('error', { error: err });
    }
      console.log("Connected to the database.");
    }
  );

  db.serialize(async () => {
    db.run(`INSERT INTO todo(todo) VALUES('${req.body.todo}');`, (err) => {
      if (err) {
        res.render('error', { error: err });
      }

      db.close((err) => {
        if (err) {
          res.render('error', { error: err });
        }
        console.log('Close the database connection');
        res.redirect('/');
      });
    });
  });
});

ROUTER.post("/delete", (req, res) => {
  let db = new SQLITE3.Database('./db/omni_mix.db', (err) => {
    if (err) {
      res.render('error', { error: err });
    }
      console.log("Connected to the database.");
    }
  );

  db.serialize(async () => {
    db.run(`UPDATE todo SET deleted = 1 WHERE id = ${req.body.id};`, (err) => {
      if (err) {
        res.render('error', { error: err });
      }

      db.close((err) => {
        if (err) {
          res.render('error', { error: err });
        }
        console.log('Close the database connection');
        res.redirect('/');
      });
    });
  });
});

export default ROUTER;
