import 'dotenv/config';
import crypto from 'crypto';
import { Request, Response } from 'express';
import initializeDB from '../../db/database';

const show_user = (req: Request, res: Response, _next: Function) => {
  res.render('user');
};

const create_user = (req: Request, res: Response, _next: Function) => {
  // if no and password in email
  // if email already exists

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');

  const db = initializeDB();
  db.serialize(() => {
    const createUser = `
      INSERT INTO user(email, hash, salt)
      VALUES('${req.body.email}','${hash}','${salt}');
    `;
    db.run(createUser, (err) => {
      console.log(err);
      if (err) {
        res.render('error', { error: err });
      }
      db.close((err) => {
        console.log(err);
        if (err) {
          res.render('error', { error: err });
        }
        res.redirect('/user');
      });
    });
  });

};

export default {
  show_user,
  create_user
}