import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const { JWT_SECRET } = process.env;
const avatarPath = path.resolve("public", "avatars");

// реєстрація
const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    // перевіряємо дублювання
    if (user) {
        throw HttpError(409, "Email in use")
    };

    // додаємо користувача з хешованим паролем
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL,
    }});
};

// автентифікація
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    // перевіряємо логін
    if (!user) {
        throw HttpError(400, "Email or password is wrong");
    };
    
    // звіряємо пароль з захешованим в базі 
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(400, "Email or password is wrong");
    };
    
    // формуємо/записуємо токен в базу користувачу
    const { _id: id } = user;
    const payload = {
        id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "3w" });
    
    await User.findByIdAndUpdate(id, { token });
    
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    });
};

// повертаємо дані користувача
const current = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription,
    });
};

// розлогінювання користувача , прибираєм його токен з бази
const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json("")
};

// зміна типу підписки користувача
const subscription = async (req, res) => {
    const { _id } = req.user;
    const { subscription = "starter" } = req.query;
    await User.findByIdAndUpdate(_id, { subscription });
    res.json({
        message: "Subscription updated"
    });
};

const avatarChange = async (req, res) => {
    const { _id } = req.user;
 
    // переносимо з тимчасового каталогу до публічного
    const { path: tmpPath, filename } = req.file;
    const newFilename = _id +'_' + filename;
    const newPath = path.join(avatarPath, newFilename);
    await fs.rename(tmpPath, newPath);
    
    const { avatarURL: oldPath } = await User.findById(_id);

    // формуємо відносний шлях та прописуємо в базу шлях до нового аватару
    const avatarURL = path.join("avatars", newFilename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    // вилучаємо старий файл
    const oldFullPath = path.join("public", oldPath)
    await fs.unlink(oldFullPath).catch(() =>
        console.log(`problem to remove file: ${oldFullPath}`)
    );

    res.json({
        avatarURL: avatarURL
    });

};

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
    subscription: ctrlWrapper(subscription),
    avatarChange: ctrlWrapper(avatarChange),
}