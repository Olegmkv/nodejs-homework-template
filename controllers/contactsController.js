import { HttpError } from "../helpers/index.js";
import contactServices from "../models/contacts.js"

const getAll = async (req, res,next) => {
  try {
    const list = await contactServices.listContacts();
    res.json(list)
  } catch (error) {
    next(error)
  }
}

const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const getId = await contactServices.getContactById(contactId);
    if (!getId) {
      throw HttpError(404,`contacts with id=${contactId} not found!`)
    }
    res.json(getId)
  } catch (error) {
    next(error)
  }
}

const addContact = async (req, res, next) => {
  try {
    const add = await contactServices.addContact(req.body);
    res.status(201).json(add)
  } catch (error) {
    next(error)
  }
}

const deleteContact =async (req, res, next) => {
  try {
    const { contactId } = req.params
    const remove = await contactServices.removeContact(contactId);
    if (!remove) {
      throw HttpError(404,`contacts with id=${contactId} not found!`)
    }
    res.json(remove)
  } catch (error) {
    next(error)
  }
}

const putContact = async (req, res, next) => {
  try {
    const { body, params: { contactId } } = req;

    if (Object.keys(body).length === 0) {
      throw HttpError(400,"missing fields")
    };

    const update = await contactServices.updateContact(contactId, body);
    
    if (!update) {
      throw HttpError(404,`contacts with id=${contactId} not found!`)
    }
      res.json(update) 
  } catch (error) {
    next(error)
  }
}

export default {
  getAll,
  getContact,
  addContact,
  deleteContact,
  putContact,
}