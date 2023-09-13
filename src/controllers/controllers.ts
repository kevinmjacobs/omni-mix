import db from '../../db/database';
import { Request, Response } from 'express';

const get_todos = (_req: Request, res: Response, _next: Function) => {
  db.serialize(() => {
    const getTodos = 'SELECT * FROM todo WHERE deleted = 0;';
    db.all(getTodos, (err, rows) => {
      if (err) {
        res.render('error', { error: err });
      }
      db.close((err) => {
        if (err) {
          res.render('error', { error: err });
        }
        res.render('index', { data: rows });
      });
    });
  })
};

const create_todo = (req: Request, res: Response, _next: Function) => {
  db.serialize(() => {
    const createTodo = `INSERT INTO todo(todo) VALUES('${req.body.todo}');`
    db.run(createTodo, (err) => {
      if (err) {
        res.render('error', { error: err });
      }
      db.close((err) => {
        if (err) {
          res.render('error', { error: err });
        }
        res.redirect('/');
      });
    });
  })
};

const delete_todo = (req: Request, res: Response, _next: Function) => {
  db.serialize(() => {
    const deleteTodo = `UPDATE todo SET deleted = 1 WHERE id = ${req.body.id};`
    db.run(deleteTodo, (err) => {
      if (err) {
        res.render('error', { error: err });
      }
      db.close((err) => {
        if (err) {
          res.render('error', { error: err });
        }
        res.redirect('/');
      });
    });
  })
};

export default {
  get_todos,
  create_todo,
  delete_todo
}
