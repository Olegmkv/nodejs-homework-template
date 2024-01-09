import Contact from "../models/Contact.js"
import { HttpError } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAll = async (req, res) => {
  const list = await Contact.find();
  res.json(list)
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const getId = await Contact.findById(contactId);
  if (!getId) {
    throw HttpError(404, `contacts with id=${contactId} not found!`)
  }
  res.json(getId)
};

const addContact = async (req, res, next) => {
  const add = await Contact.create(req.body);
  res.status(201).json(add)
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params
  const remove = await Contact.findByIdAndDelete(contactId);
  if (!remove) {
    throw HttpError(404, `contacts with id=${contactId} not found!`)
  }
  res.json(remove)
};

const putContact = async (req, res, next) => {
  const { body, params: { contactId } } = req;
console.log('put=> ',body);
  const update = await Contact.findByIdAndUpdate(contactId, body);
    
  if (!update) {
    throw HttpError(404, `contacts with id=${contactId} not found!`)
  }
  res.json(update)
};

export default {
  getAll: ctrlWrapper(getAll),
  getContact: ctrlWrapper(getContact),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  putContact: ctrlWrapper(putContact),
}