import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import User from "../models/User.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const { JWT_SECRET, BASE_URL } = process.env;
const avatarPath = path.resolve("public", "avatars");

// ====================================================== реєстрація
const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    // перевіряємо дублювання
    if (user) {
        throw HttpError(409, "Email in use")
    };

    // додаємо користувача з хешованим паролем, 
    // генерованою аватаркою
    // та токеном для верифікаї емаіл 
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    
    // відправляємо на емаіл користувача посилання для підтвердження емаіл
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="blank" href="${BASE_URL}api/users/verify/${verificationToken}">Click me to verify you email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
    }});
};

// ============================================== веріфікація емайлу
const verify = async (req, res) => {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken })

    if (!user) {
        throw HttpError(400, "Email not found");
    };

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
 
    res.json({
        message: "Email success verificate"});
};

// === дублююче відсилання токену на пошту для підтвердження емаілу 
const resendEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        throw HttpError(404, "Email not found");
    };

    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    };

     // відправляємо на емаіл користувача посилання для підтвердження емаіл
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="blank" href="${BASE_URL}api/users/verify/${user.verificationToken}">Click me to verify you email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Sending an email for verification"});
};


// ================================================= автентифікація
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    // перевіряємо логін
    if (!user) {
        throw HttpError(400, "Email or password is wrong");
    };

    // чи веріфікований користувач
    if (!user.verify) {
        throw HttpError(400, "Email not verify");
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

// =================================== повертаємо дані користувача
const current = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription,
    });
};

// ====== розлогінювання користувача , прибираєм його токен з бази
const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json("")
};

// ============================== зміна типу підписки користувача
const subscription = async (req, res) => {
    const { _id } = req.user;
    const { subscription = "starter" } = req.query;
    await User.findByIdAndUpdate(_id, { subscription });
    res.json({
        message: "Subscription updated"
    });
};

// ================================== заміна аватарки користувача
const avatarChange = async (req, res) => {
    const { _id } = req.user;
    const { path: tmpPath, filename } = req.file;
    
    const newFilename = _id +'_' + filename;
    const newPath = path.join(avatarPath, newFilename);
    
    // оптимизуємо зображення отримане в тичасовому каталозі
    // та зберігаємо його у теку для публічного користування
    Jimp.read(tmpPath)
    .then((avva) => {
        return avva
            .resize(250, 250)
            .quality(70)
            .writeAsync(newPath)
    })
        .catch((err) => {
        console.log(err);
        throw HttpError(401, "Not authorized");
    });
  
    // запамятовуємо шлях до попередньої аватарки
    const { avatarURL: oldPath } = await User.findById(_id);

    // формуємо відносний шлях та прописуємо в базу шлях до нового аватару
    const avatarURL = path.join("avatars", newFilename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    // вилучаємо нову тимчасову і попередню аватарки
    // при помилці не зупиняємо обробку запиту
    await fs.unlink(tmpPath).catch(() =>
        console.log(`problem with removing files: ${tmpPath}`)
    );
    if (oldPath.indexOf("www.gravatar.com")===-1) {
        const oldFullPath = path.join("public", oldPath)
        await fs.unlink(oldFullPath).catch(() =>
            console.log(`problem with removing files: ${oldFullPath}`)
        );
    };

    res.json({
        avatarURL
    });

};

export default {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendEmail: ctrlWrapper(resendEmail),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
    subscription: ctrlWrapper(subscription),
    avatarChange: ctrlWrapper(avatarChange),
}