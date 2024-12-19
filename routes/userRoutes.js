import express from 'express'

const router = express.Router();

router.get('/',getAllUsers);
router.get('/profile',getUserProfile);
router.post('/login',loginUser);
router.post('/register',registerUser);

export default router