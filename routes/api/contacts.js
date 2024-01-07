import express from 'express';
import contactsController from '../../controllers/contactsController.js';
import { isValidId, isEmptyBody } from '../../middlewares/validates/index.js';
import { validateAddContact, validateChangeContact, validateUpdateStatus } from '../../models/Contact.js';

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:contactId', isValidId, contactsController.getContact);

contactsRouter.post('/', isEmptyBody, validateAddContact, contactsController.addContact);

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteContact);

contactsRouter.put('/:contactId', isValidId, isEmptyBody, validateChangeContact, contactsController.putContact);

contactsRouter.patch('/:contactId/favorite', isValidId, isEmptyBody, validateUpdateStatus, contactsController.putContact);

export default contactsRouter;


// const express = require('express')

// const router = express.Router()

// router.get('/', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

// router.get('/:contactId', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

// router.post('/', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

// router.delete('/:contactId', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

// router.put('/:contactId', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

// module.exports = router
