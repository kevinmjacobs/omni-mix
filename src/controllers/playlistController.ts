import 'dotenv/config';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../db/database';

const showPlaylists = async (req: Request, res: Response, _next: NextFunction) => {
  if (req.session.email) {
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
  } else {
    res.redirect('login');
  }
}

const getPlaylist = async (req: Request, res: Response, _next: NextFunction) => {
  if (req.session.email && req.params.playlist_id) {
    const user = await User.findOne({email: req.session.email});
    if (user && user.access_token) {
      try {
        const items = await getAllItems(req.params.playlist_id, user.access_token);      
        res.render('playlist', {
          session: req.session,
          items: items
        });
      } catch (error) {
        res.render('error', {
          error,
        });
      }
    } else {
      res.redirect('/playlists');
    }
  } else {
    res.redirect('/playlists');
  }
};

const getAllItems = async (playlistId: string, accessToken: string) => {
  let items: Array<object> = [];
  let url: string | boolean = `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks?limit=100`;
  while (url) {
    await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      items = items.concat(response.data.items);
      url = response.data.next;
    }).catch ((error) => {
      console.log(error);
      url = false;
    });
  }
  return items;
};

export default {
  showPlaylists,
  getPlaylist
}