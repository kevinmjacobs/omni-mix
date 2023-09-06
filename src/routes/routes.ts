import express from 'express';
import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();
const router = express.Router();

router.get('/', (req, res, next) => {
  let db = new sqlite.Database('./db/omni_mix.db', (err) => {
    if (err) {
      res.render('error', { error: err });
    }

    console.log("Connected to the database.");
  });

  db.serialize(() => {
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

router.post("/", (req, res) => {
  let db = new sqlite.Database('./db/omni_mix.db', (err) => {
    if (err) {
      res.render('error', { error: err });
    }

    console.log("Connected to the database.");
  });

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

router.post("/delete", (req, res) => {
  let db = new sqlite.Database('./db/omni_mix.db', (err) => {
    if (err) {
      res.render('error', { error: err });
    }

    console.log("Connected to the database.");
  });

  db.serialize(() => {
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

export default router;