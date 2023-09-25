import 'dotenv/config';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { connectDB, User } from '../../db/database';

const get_auth = (req: Request, res: Response, _next: Function) => {
  res.render('auth');
};

const get_authorize = (req: Request, res: Response, _next: Function) => {
  const state = crypto.randomBytes(8).toString('hex');
  const scope = 'user-read-private user-read-email';

  console.log(process.env.SPOTIFY_CLIENT);

  res.redirect(`https://accounts.spotify.com/authorize?` +
    `response_type=code&` +
    `client_id=${process.env.SPOTIFY_CLIENT}&` +
    `scope=${scope}&` +
    `redirect_uri=http://localhost:3000/auth/spotify_callback&` +
    `state=${state}`
  );
};

const spotify_callback = async (req: Request, res: Response, _next: Function) => {
  const accessCode = req.query?.code;
  const state = req.query?.state;
  const email = req.session?.user;
  if (accessCode && state && email) {
    connectDB();
    await User.findOneAndUpdate(
      { email },
      { access_code: accessCode, state }
    );
  }
  res.redirect('/auth');

}

export default {
  get_auth,
  get_authorize,
  spotify_callback
};
