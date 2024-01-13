// задати статус помилки 400
export const handleSaveError = (error, data, next) => {
    const { name, code } = error;
    error.status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
    next();
};

// параметри налаштування: 1.повертати обєкт зі змінами
// 2.перевіряти дані при додаванні по схемі mongoose
export const addUpdateSettings = function (next) {
    this.options.new = true;
    this.options.runValidators = true;
    next();
};
