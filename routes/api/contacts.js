import express from 'express'
import contactsController from '../../controllers/contactsController.js'
import { validateAddContact, validateChangeContact } from '../../middlewares/validates/validateContacts.js'

const contactsRouter = express.Router()

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', contactsController.getContact)

contactsRouter.post('/', validateAddContact, contactsController.addContact)

contactsRouter.delete('/:contactId', contactsController.deleteContact)

contactsRouter.put('/:contactId',validateChangeContact, contactsController.putContact )

export default contactsRouter
