import express from 'express'
import { getAllUsers,getUserById,loginUser,registerUser,updateUser,deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/',getAllUsers);
router.get('/:id',getUserById);
router.post('/login',loginUser);
router.post('/register',registerUser);
router.put('/:id',updateUser)
router.delete("/:id", deleteUser);

export default router