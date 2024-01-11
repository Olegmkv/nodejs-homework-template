import jwt from "jsonwebtoken";
import { HttpError } from "../../helpers/index.js";
import User from "../../models/Users.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    // розбираємо заголовок
    const { authorization } = req.headers;
    if (!authorization) {
        return next(HttpError(401, "Authorization not define"));
    };
    // виділяємо токен
    const [bearer, token] = authorization.split(" ");
    if (!bearer === "Bearer") {
        return next(HttpError(401, "Not Bearer"));
    };
    // верифікуємо токен, порівнюємо зі збереженим в базі у користувача
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);

        if (!user || !user.token || token !== user.token) {
            return next(HttpError(401));
        };

        // зберігаємо для інших маршрутів користувача
        req.user = user;
        next();
    }
    catch (error) {
        next(HttpError(401, error.message));
    };
};

export default authenticate