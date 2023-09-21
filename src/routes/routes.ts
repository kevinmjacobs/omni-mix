import express from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';
import { Request , Response } from 'express';

const router = express.Router();

declare module 'express-session' {
  export interface SessionData {
    user: any;
    loggedIn: any;
  }
}

router.get('/', (req: Request, res: Response) => {
  res.locals.user = req.session.user;
  res.locals.loggedIn = req.session.loggedIn;
  res.render('index');
});

router.get('/user', userController.show_user);
router.post('/user/create', userController.create_user);
router.post('/user/login', userController.login_user);

router.get('/auth', authController.get_auth);
router.get('/auth/authorize', authController.get_authorize);

export default router;