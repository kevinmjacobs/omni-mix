import express from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';
import { Request , Response } from 'express';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('index');
});

router.get('/user', userController.show_user);
router.post('/user/create', userController.create_user);

router.get('/auth', authController.get_auth);
router.get('/auth/authorize', authController.get_authorize);

export default router;