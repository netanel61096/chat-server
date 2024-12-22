import express from 'express'
import { getAllUsers,getUserById,loginUser,registerUser,updateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/',getAllUsers);
router.get('/:id',getUserById);
router.post('/login',loginUser);
router.post('/register',registerUser);
router.put('/:id',updateUser)

export default router