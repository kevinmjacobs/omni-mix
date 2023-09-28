import 'dotenv/config';
import axios from 'axios';
import { HydratedDocument } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../../db/database';
import { generateBearerToken }  from './helpers';

interface QueryString {
  code: string;
  state: string;
}

const redirectURI = 'http://localhost:3000/auth/spotify_callback';
const tokenURL = 'https://accounts.spotify.com/api/token';

const spotifyCallback = async (req: Request, res: Response, _next: NextFunction) => {
  const query = req.query as unknown as QueryString;

  const accessCode: string | undefined = query.code;
  const state: string | undefined = query.state;
  const email: string | undefined = req.session.email;

  if (accessCode && state && email) {
    const user = await findUser(email);
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
      if (user) {
        user.access_token = response.data.access_token;
        user.refresh_token = response.data.refresh_token;
        saveUser(user);
        if (!user.spotify_id) {
          axios.get('https://api.spotify.com/v1/me',{
            headers: {
              'Authorization': `Bearer ${response.data.access_token}`
            }
          }).then((response) => {
            user.spotify_id = response.data.id;
            saveUser(user);
            res.redirect('/');
          }).catch((error) => {
            res.render('error', { error });
          });
        } else {
          res.redirect('/');
        }
      } else {
        res.render('error', { error: 'User not found!' });
      }
    }).catch((error) => {
      res.render('error', { error });
    });
  } else {
    res.render('error', { error: 'Unable to authenticate!' });
  }
}

const findUser = async (email: string) => {
  const user: HydratedDocument<IUser> | null = await User.findOne({ email: email });
  return user;
}

const saveUser = async (user: HydratedDocument<IUser> ) => {
  await user.save();
  return user;
}

export default {
  spotifyCallback
};
