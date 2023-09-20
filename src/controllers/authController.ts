import 'dotenv/config';
import crypto from 'crypto';
import { Request, Response } from 'express';

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
    `redirect_uri=http://localhost:3000&` +
    `state=${state}`
  );
};

export default {
  get_auth,
  get_authorize
};
