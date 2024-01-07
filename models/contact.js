import { Schema, model } from "mongoose";
import { handleSaveError,addUpdateSettings } from "./hooks.js";
import Joi from "joi";
import HttpError from "../helpers/HttpError.js"

// схема бази даних mongoose
const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
}, {
    versionKey: false,
    timestamps: true,
});

// монгус хук: після додавання, при помилці, 
// задати статус помилки 400 і продовжити виконання коду
contactSchema.post("save", handleSaveError);

// після оновлення, в разі помилки задати їй стаус 400  
contactSchema.post("findOneAndUpdate",handleSaveError)

// перед оновленням задати параметри налаштування
contactSchema.pre("findOneAndUpdate", addUpdateSettings);


// joi схеми та функції для перевірки фронтенда
const schemeAddContact = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().required().min(5),
    phone: Joi.string().required().min(5),
    favorite: Joi.boolean(),
});

const schemeChangeContact = Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().min(5),
    phone: Joi.string().min(5),
    favorite: Joi.boolean(),
});

const schemeUpdateStatus = Joi.object({
    favorite: Joi.boolean().required(),
});

export const validateAddContact = async (req, res, next) => {
    try {
        const contact = req.body;
        const { error } = schemeAddContact.validate(contact);
        if (error) {
            throw HttpError(400, error.message);
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const validateChangeContact = async (req, res, next) => {
    try {
        const contact = req.body;
        const { error } = schemeChangeContact.validate(contact);
        if (error) {
            throw HttpError(400, error.message);
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const validateUpdateStatus = async (req, res, next) => {
    try {
        const contact = req.body;
        const { error } = schemeUpdateStatus.validate(contact);
        if (error) {
            throw HttpError(400, error.message);
        }
        next();
    } catch (error) {
        next(error);
    }
}


// створюємо модель-класс
const Movie = model("contact", contactSchema);

export default Movie




// const fs = require('fs/promises')

// const listContacts = async () => {}

// const getContactById = async (contactId) => {}

// const removeContact = async (contactId) => {}

// const addContact = async (body) => {}

// const updateContact = async (contactId, body) => {}

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// }
