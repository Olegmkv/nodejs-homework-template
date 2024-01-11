import Contact from "../models/Contact.js"
import { HttpError } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const list = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate("owner", "username");
  res.json(list);
};

const getContact = async (req, res, next) => {
  const { contactId: _id } = req.params;
  const { _id: owner } = req.user;
  const getId = await Contact.findOne({ _id, owner });
  if (!getId) {
    throw HttpError(404, `contacts with id=${_id} not found!`)
  }
  res.json(getId)
};

const addContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const add = await Contact.create({ ...req.body, owner });
  res.status(201).json(add)
};

const deleteContact = async (req, res, next) => {
  const { contactId: _id } = req.params;
  const { _id: owner } = req.user;
  const remove = await Contact.findOneAndDelete({ _id, owner });
  if (!remove) {
    throw HttpError(404, `contacts with id=${_id} not found!`)
  }
  res.json(remove)
};

const putContact = async (req, res, next) => {
  const { body, params: { contactId: _id } } = req;
  const { _id: owner } = req.user;

  const update = await Contact.findOneAndUpdate({ _id, owner }, body);
    
  if (!update) {
    throw HttpError(404, `contacts with id=${_id} not found!`)
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