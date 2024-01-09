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
export const schemeAddContact = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().required().min(5),
    phone: Joi.string().required().min(5),
    favorite: Joi.boolean(),
});

export const schemeChangeContact = Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().min(5),
    phone: Joi.string().min(5),
    favorite: Joi.boolean(),
});

export const schemeUpdateStatus = Joi.object({
    favorite: Joi.boolean().required(),
});

// створюємо модель-класс
const Contact = model("contact", contactSchema);

export default Contact
