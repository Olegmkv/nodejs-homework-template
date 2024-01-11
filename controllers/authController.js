import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import { HttpError } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const { JWT_SECRET } = process.env;

// реєстрація
const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    // перевіряємо дублювання
    if (user) {
        throw HttpError(409, "Email in use")
    };

    // додаємо користувача з хешованим паролем
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.json({
        username: newUser.username,
        email: newUser.email,
    });
};

// автентифікація
const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    // перевіряємо логін
    if (!user) {
        throw HttpError(400, "Email or password invalid");
    };
    
    const passwordCompare = await bcrypt.compare(password, user.password);
    
    if (!passwordCompare) {
        throw HttpError(400, "Email or password invalid");
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
    });
};

// повертаємо дані користувача
const getCurrent = async (req, res) => {
    const { username, email } = req.user;
    res.json({
        username,
        email,
    })
}

// розлогінювання користувача , прибираєм його токен з бази
const signout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({
        message: "Logout success"
    })
}

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
}