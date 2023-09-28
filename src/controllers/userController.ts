import 'dotenv/config';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { connectDB, User } from '../../db/database';

const show_login = (req: Request, res: Response, _next: NextFunction) => {
  res.render('login', { session: req.session });
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
        authorize_user(res);
      } else {
        console.log('no match')
        res.render('login');
      }
    } else {
      console.log('no user')
      res.render('login');
    }
  } else {
    console.log('not enough info')
    res.render('login');
  }
};

const redirectURI = 'http://localhost:3000/auth/spotify_callback';
const authorizeURL = 'https://accounts.spotify.com/authorize';

const authorize_user = async (res: Response) => {
  const state = crypto.randomBytes(8).toString('hex');
  const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';

  res.redirect(`${authorizeURL}?` +
    `response_type=code&` +
    `client_id=${process.env.SPOTIFY_CLIENT}&` +
    `scope=${scope}&` +
    `redirect_uri=${redirectURI}&` +
    `state=${state}`
  );
}

export default {
  show_login,
  create_user,
  login_user
}