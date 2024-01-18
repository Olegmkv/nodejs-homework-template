import multer from "multer";
import path from "path";
import { HttpError } from "../../helpers/index.js";

const destination = path.resolve("tmp");
const supportedType = ["jpeg", "png", "bmp", "tiff", "gif"];

// формуємо унікальне імя для збереження файлу
const storage = multer.diskStorage({
    destination,
    filename: (req, file, callback) => {
        const uniquiePrefix = `${Date.now()}`;
        const filename = `${uniquiePrefix}_${file.originalname}`
        callback(null, filename);
    }
});

// описуємо обмеження max 5 Mb
const limits = {
    fileSize: 1024 * 1024 * 5,
};

// описуємо фільтр за типом файлу
const fileFilter = (req, file, callback) => {
    const extension = file.originalname.split(".").pop();
    if (!supportedType.includes(extension)){
        callback(HttpError(400, "Invalid file type"));
    };
    callback(null, file);
};

// створюємо обєкт мультера за налаштуваннями
const upload = multer({
    storage,
    limits,
    fileFilter,
});

export default upload;