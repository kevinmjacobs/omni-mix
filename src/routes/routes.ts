import express from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';
import playlistController from '../controllers/playlistController';
import { Request , Response } from 'express';

const router = express.Router();

declare module 'express-session' {
  export interface SessionData {
    email: string;
    loggedIn: boolean;
  }
}

router.get('/', (req: Request, res: Response) => {
  if (req.session.loggedIn) {
    res.render('index', { session: req.session });
  } else {
    res.redirect('/login');
  }
});

router.get('/login', userController.showLogin);
router.get('/create', userController.showCreateUser);
router.post('/login', userController.loginUser);
router.post('/create', userController.createUser);

router.get('/auth/spotify_callback', authController.spotifyCallback)

router.get('/playlists', playlistController.showPlaylists);
router.get('/playlists/:playlist_id', playlistController.getPlaylist);
router.get('/search', playlistController.searchDiscogsDatabase);

export default router;