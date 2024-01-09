import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError,addUpdateSettings } from "./hooks.js";

const emailRegexp =/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    }
}, {
    versionKey: false,
    timestamps: true,
});

// монгус хук: після додавання, при помилці, 
// задати статус помилки 400,409 і продовжити виконання коду
userSchema.post("save", handleSaveError);

// після оновлення, в разі помилки задати їй стаус 400,409  
userSchema.post("findOneAndUpdate",handleSaveError)

// перед оновленням задати параметри налаштування
userSchema.pre("findOneAndUpdate", addUpdateSettings);

// joi схеми та функції для перевірки фронтенда
export const userSignupSchema = Joi.object({
    username: Joi.string().required().min(2),
    email: Joi.string().pattern(emailRegexp).required().min(5),
    password: Joi.string().required().min(6),
});

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().min(5),
    password: Joi.string().required().min(6),
});


// створюємо модель-класс
const User = model("user", userSchema);

export default User