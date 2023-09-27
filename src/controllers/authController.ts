import 'dotenv/config';
import crypto from 'crypto';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { connectDB, User } from '../../db/database';
import { generateBearerToken }  from './helpers';

interface QueryString {
  code: string;
  state: string;
}

const redirectURI = 'http://localhost:3000/auth/spotify_callback';
const authorizeURL = 'https://accounts.spotify.com/authorize';
const tokenURL = 'https://accounts.spotify.com/api/token';

const get_auth = (req: Request, res: Response, _next: NextFunction) => {
  res.render('auth', { session: req.session });
};

const get_authorize = (_req: Request, res: Response, _next: NextFunction) => {
  const state = crypto.randomBytes(8).toString('hex');
  const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';

  res.redirect(`${authorizeURL}?` +
    `response_type=code&` +
    `client_id=${process.env.SPOTIFY_CLIENT}&` +
    `scope=${scope}&` +
    `redirect_uri=${redirectURI}&` +
    `state=${state}`
  );
};

const spotify_callback = async (req: Request, res: Response, _next: NextFunction) => {
  const query = req.query as unknown as QueryString;

  const accessCode: string | undefined = query.code;
  const state: string | undefined = query.state;
  const email: string | undefined = req.session.email;

  if (accessCode && state && email) {
    const authHeader:string = generateBearerToken();

    axios.post(tokenURL, {
      code: accessCode,
      redirect_uri: redirectURI,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      saveAccessTokens(email, response.data.access_token, response.data.refresh_token);
      axios.get('https://api.spotify.com/v1/me',{
        headers: {
          'Authorization': `Bearer ${response.data.access_token}`
        }
      }).then((response) => {
        saveSpotifyID(email, response.data.id);
        res.redirect('/auth');
      }).catch((error) => {
        res.render('error', { error });
      });
    }).catch((error) => {
      res.render('error', { error });
    });
  } else {
    res.render('error', { error: 'Unable to authenticate!' });
  }
}

const saveAccessTokens = async (email: string, access_token: string, refresh_token: string) => {
  connectDB();
  await User.findOneAndUpdate(
    { email },
    { access_token, refresh_token }
  );
}

const saveSpotifyID = async (email: string, spotify_id: string) => {
  connectDB();
  await User.findOneAndUpdate(
    { email },
    { spotify_id }
  );
}

export default {
  get_auth,
  get_authorize,
  spotify_callback
};
