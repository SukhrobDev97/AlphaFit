import express from 'express';
const router = express.Router();
import memberController from './controllers/member.controller';
import uploader from './libs/utils/uploader';

router.post('/member/login', memberController.login)
router.post('/member/signup', memberController.signup)
router.post('/member/logout', memberController.verifyAuth, memberController.logout)
router.get('/member/detail', memberController.verifyAuth)
router.get('/member/detail', memberController.verifyAuth, memberController.getMemberDetail)

router.post(
    '/member/update',
     memberController.verifyAuth,
     uploader('members').single('memberImage'),
     memberController.updateMember
)

export default router