import express from 'express';
import authController from '../../controllers/authController.js';
import { authenticate, isEmptyBody } from '../../middlewares/validates/index.js';
import validateBody from '../../decorators/validateBody.js';
import { userSigninSchema, userSignupSchema, userSubscribeSchema } from '../../models/Users.js';

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(userSignupSchema), authController.register);

authRouter.post('/login', isEmptyBody, validateBody(userSigninSchema), authController.login);

authRouter.get('/current', authenticate, authController.current);

authRouter.post('/logout', authenticate, authController.logout);

authRouter.patch('/', authenticate, validateBody(userSubscribeSchema), authController.subscription);

export default authRouter;