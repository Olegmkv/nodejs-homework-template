import express from 'express';
import contactsController from '../../controllers/contactsController.js';
import { isValidId, isEmptyBody } from '../../middlewares/validates/index.js';
import validateBody from "../decorators/validateBody.js";
import { schemeAddContact, schemeChangeContact, schemeUpdateStatus } from '../../models/Contact.js';

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:contactId', isValidId, contactsController.getContact);

contactsRouter.post('/', isEmptyBody, validateBody(schemeAddContact), contactsController.addContact);

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteContact);

contactsRouter.put('/:contactId', isValidId, isEmptyBody, validateBody(schemeChangeContact), contactsController.putContact);

contactsRouter.patch('/:contactId/favorite', isValidId, isEmptyBody, validateBody(schemeUpdateStatus), contactsController.putContact);

export default contactsRouter;

