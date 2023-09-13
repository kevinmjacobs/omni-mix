import express from 'express';
import controllers from '../controllers/controllers';

const router = express.Router();

router.get('/', controllers.get_todos);
router.post("/", controllers.create_todo);
router.post("/delete", controllers.delete_todo);

export default router;