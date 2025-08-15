import express from 'express';
const router = express.Router();
import memberController from './controllers/member.controller';

router.get('/login', memberController.login)
router.get('/signup', memberController.signup)

export default router