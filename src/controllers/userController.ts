import 'dotenv/config';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { connectDB, User } from '../../db/database';

const show_user = (req: Request, res: Response, _next: Function) => {
  res.render('user');
};

const create_user = async (req: Request, res: Response, _next: Function) => {
  // if no and password in email
  // if email already exists

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(
    req.body.password,
    salt,
    1000,
    64,
    'sha512'
  ).toString('hex');

  connectDB();
  const newUser = new User({
    email: 'test',
    hash: hash,
    salt: salt
  });
  try {
    await newUser.save();
    res.redirect('/user');
  } catch (e) {
    res.render('error', { error: e });
  }
};

export default {
  show_user,
  create_user
}