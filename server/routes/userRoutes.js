import express from 'express'
import { getAllUsers,getUserById,loginUser,registerUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/',getAllUsers);
router.get('/:id',getUserById);
router.post('/login',loginUser);
router.post('/register',registerUser);

export default router