import Joi from "joi"
import { HttpError } from "../../helpers/index.js";

const schemeAddContact = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().required().min(5),
    phone: Joi.string().required().min(5),
});

const schemeChangeContact = Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().min(5),
    phone: Joi.string().min(5),
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