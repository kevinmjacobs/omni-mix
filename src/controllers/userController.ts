import 'dotenv/config';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { connectDB, User } from '../../db/database';

const show_user = (req: Request, res: Response, _next: NextFunction) => {
  res.render('user', { session: req.session });
};

const create_user = async (req: Request, res: Response, _next: NextFunction) => {
  // if no and password in email
  // if email already exists

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync( req.body.password, salt, 1000, 64, 'sha512' ).toString('hex');

  connectDB();
  const newUser = new User({email: req.body.email, hash: hash, salt: salt });
  try {
    await newUser.save();
    res.redirect('/user');
  } catch (e) {
    res.render('error', { error: e });
  }
};

const login_user = async (req: Request, res: Response, _next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email && password) {
    connectDB();
    const user = await User.findOne({ email });

    if (user) {
      const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512` ).toString('hex');
      if (hashedPassword === user.hash) {
        console.log('a match!');
        req.session.email = email;
        req.session.loggedIn = true;
        res.redirect('/user');
      } else {
        console.log('no match')
        res.redirect('/user');
      }
    } else {
      console.log('no user')
      res.redirect('/user');
    }
  } else {
    console.log('not enough info')
    res.redirect('/user');
  }
};

export default {
  show_user,
  create_user,
  login_user
}