import express from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';
import playlistController from '../controllers/playlistController';
import { Request , Response, NextFunction } from 'express';

const router = express.Router();

declare module 'express-session' {
  export interface SessionData {
    email: string;
    loggedIn: boolean;
  }
}

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  if (req.session.loggedIn) {
    playlistController.showPlaylists(req, res, next)
  } else {
    res.redirect('/login');
  }
});

router.get('/login', userController.showLogin);
router.get('/create', userController.showCreateUser);
router.post('/login', userController.loginUser);
router.post('/create', userController.createUser);
router.get('/logout', userController.logoutUser);

router.get('/auth/spotify_callback', authController.spotifyCallback)

router.get('/playlists/:playlist_id', playlistController.getPlaylist);
router.get('/search', playlistController.searchDiscogsDatabase);

export default router;