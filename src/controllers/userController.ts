import 'dotenv/config';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../db/database';

const showLogin = (req: Request, res: Response, _next: NextFunction) => {
  res.render('login', { session: req.session });
};

const createUser = async (req: Request, res: Response, _next: NextFunction) => {
  // if no and password in email
  // if email already exists

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync( req.body.password, salt, 1000, 64, 'sha512' ).toString('hex');

  const newUser = new User({email: req.body.email, hash: hash, salt: salt });
  try {
    await newUser.save();
    res.render('login');
  } catch (e) {
    res.render('error', { error: e });
  }
};

const loginUser = async (req: Request, res: Response, _next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email && password) {
    const user = await User.findOne({ email });

    if (user) {
      const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512` ).toString('hex');
      if (hashedPassword === user.hash) {
        console.log('a match!');
        req.session.email = email;
        req.session.loggedIn = true;
        authorizeUser(res);
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

const authorizeUser = async (res: Response) => {
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
  showLogin,
  createUser,
  loginUser
}