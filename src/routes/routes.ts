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
  res.render('index', { session: req.session });
});

router.get('/user', userController.show_user);
router.post('/user/create', userController.create_user);
router.post('/user/login', userController.login_user);

router.get('/auth', authController.get_auth);
router.get('/auth/authorize', authController.get_authorize);
router.get('/auth/spotify_callback', authController.spotify_callback)

router.get('/playlists', playlistController.show_playlists);

export default router;