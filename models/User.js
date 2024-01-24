import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError,addUpdateSettings } from "./hooks.js";

const emailRegexp =/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
const subscriptionExp = ["starter", "pro", "business"];

const userSchema = new Schema({
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Set password for user'],
        minlength: 6,
    },
    subscription: {
        type: String,
        enum: subscriptionExp,
        default: "starter"
    },
    token: {
      type: String,  
    },
    avatarURL: {
        type: String,
        required: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
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
    email: Joi.string().pattern(emailRegexp).required().min(5),
    password: Joi.string().required().min(6),
});

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().min(5),
    password: Joi.string().required().min(6),
});

export const userSubscribeSchema = Joi.object({
    subscription: Joi.string().valid(...subscriptionExp)
})

export const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().min(5)
        .messages({ 'any.required': `missing required field email` }),
});

// створюємо модель-класс
const User = model("user", userSchema);

export default User