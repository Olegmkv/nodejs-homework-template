import express from 'express';
import { isValidId, isEmptyBody } from '../../middlewares/validates/index.js';


const authRouter = express.Router();

// authRouter.get('/', contactsController.getAll);


export default authRouter;