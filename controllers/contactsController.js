import Contact from "../models/Contact.js"
import { HttpError } from "../helpers/index.js";

const getAll = async (req, res,next) => {
  try {
    const list = await Contact.find();
    res.json(list)
  } catch (error) {
    next(error)
  }
}

const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const getId = await Contact.findById(contactId);
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
    const add = await Contact.create(req.body);
    res.status(201).json(add)
  } catch (error) {
    next(error)
  }
}

const deleteContact =async (req, res, next) => {
  try {
    const { contactId } = req.params
    const remove = await Contact.findByIdAndDelete(contactId);
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

    const update = await Contact.findByIdAndUpdate(contactId, body);
    
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