import express from 'express';
import authController from '../../controllers/authController.js';
import { authenticate, isEmptyBody } from '../../middlewares/validates/index.js';
import validateBody from '../../decorators/validateBody.js';
import { userSigninSchema, userSignupSchema } from '../../models/Users.js';

const authRouter = express.Router();

authRouter.post('/signup', isEmptyBody, validateBody(userSignupSchema), authController.signup);

authRouter.post('/signin', isEmptyBody, validateBody(userSigninSchema), authController.signin);

authRouter.get('/current', authenticate, authController.getCurrent);

authRouter.post('/signout', authenticate, authController.signout);

export default authRouter;