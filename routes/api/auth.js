import express from 'express';
import authController from '../../controllers/authController.js';
import { authenticate, isEmptyBody, upload } from '../../middlewares/validates/index.js';
import validateBody from '../../decorators/validateBody.js';
import { userSigninSchema, userSignupSchema, userEmailSchema, userSubscribeSchema } from '../../models/User.js';

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(userSignupSchema), authController.register);

authRouter.get('/verify/:verificationToken', authController.verify);

authRouter.post('/verify', isEmptyBody, validateBody(userEmailSchema), authController.resendEmail)

authRouter.post('/login', isEmptyBody, validateBody(userSigninSchema), authController.login);

authRouter.get('/current', authenticate, authController.current);

authRouter.post('/logout', authenticate, authController.logout);

authRouter.patch('/', authenticate, validateBody(userSubscribeSchema), authController.subscription);

authRouter.patch('/avatars', authenticate, upload.single("avatarURL"), authController.avatarChange);

export default authRouter;