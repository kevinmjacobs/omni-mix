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
    res.render('login');
  }
});

router.get('/login', userController.show_login);
router.post('/user/create', userController.create_user);
router.post('/login', userController.login_user);

router.get('/auth/spotify_callback', authController.spotify_callback)

router.get('/playlists', playlistController.show_playlists);

export default router;