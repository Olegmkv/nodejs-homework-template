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
        throw HttpError(409, "Email already use")
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
    
    // записуємо токен
    const { _id: id } = user;
    const payload = {
        id,
    };
    console.log(JWT_SECRET);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "3w" });
    res.json({
        token,
    });
};

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
}