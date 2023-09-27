import 'dotenv/config';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { connectDB, User } from '../../db/database';

const show_playlists = async (req: Request, res: Response, _next: NextFunction) => {
  connectDB();
  const user = await User.findOne({email: req.session.email});
  if (user && user.spotify_id) {
    axios.get(`https://api.spotify.com/v1/users/${encodeURIComponent(user.spotify_id)}/playlists?offset=0&limit=50`, {
      headers: {
        'Authorization': `Bearer ${user.access_token}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      res.render('playlists', {
        session: req.session,
        playlists: response.data.items
      });
    }).catch((error) => {
      console.log(error);
      res.render('error', {
        error,
        playlists: []
      });
    });
  } else {
    res.render('playlists', {
      session: req.session,
      playlists: []
    });
  }
}

export default {
  show_playlists
}