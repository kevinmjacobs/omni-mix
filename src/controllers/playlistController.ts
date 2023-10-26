import 'dotenv/config';
import axios from 'axios';
import memoize from 'memoizee';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../db/database';
import { formatDuration, formatReleases } from './helpers';
import { QueryString, PlaylistItem } from './interfaces';

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
        res.render('tracks', {
          session: req.session,
          items
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

const getAllItems = memoize(async (playlistId: string, accessToken: string) => {
  let items: PlaylistItem[] = [];
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
  return formatItems(items);
});

const formatItems = memoize((items: PlaylistItem[]) => {
  items.forEach((item: PlaylistItem) => {
    item.track.artistNames = item.track.artists.map((artist) => { return artist.name } ).join(", ");
    item.track.duration_ms = formatDuration(parseInt(item.track.duration_ms,10));
    return item;
  });
  return items;
});

const searchDiscogsDatabase = async (req: Request, res: Response, _next: NextFunction) => {
  const query = req.query as unknown as QueryString;

  const track: string | undefined = query.title;
  const artist: string | undefined = query.artist;
  const album: string | undefined = query.album;
  const email: string | undefined = req.session.email;

  if (email && (track || artist || album)) {
    let params = {
      type: "release",
      track,
      artist,
      release_title: album
    };

    let results: [] = [];

    await axios.get('https://api.discogs.com/database/search', {
      params,
      headers: {
        'Authorization': `Discogs key=${process.env.DISCOGS_CONSUMER_KEY}, secret=${process.env.DISCOGS_CONSUMER_SECRET}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      results = response.data.results;
    }).catch((error) => {
      console.log(error);
      res.send('error');
    });

    if (results.length > 0) {
      const formatedData: object[] = formatReleases(results);
      res.json(formatedData);
    } else {
      delete params.track; // widen search for just album release and artist

      await axios.get('https://api.discogs.com/database/search', {
        params,
        headers: {
          'Authorization': `Discogs key=${process.env.DISCOGS_CONSUMER_KEY}, secret=${process.env.DISCOGS_CONSUMER_SECRET}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        results = response.data.results;
      }).catch((error) => {
        console.log(error);
        res.send('error');
      });

      const formatedData: object[] = formatReleases(results);
      res.json(formatedData);
    }
  } else {
    console.log('no user or no search params');
    res.send('error');
  }
};

export default {
  showPlaylists,
  getPlaylist,
  searchDiscogsDatabase
}