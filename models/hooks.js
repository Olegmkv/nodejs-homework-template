// задати статус помилки 400
export const handleSaveError = (error, data, next) => {
    error.status = 400;
    next();
};

// параметри налаштування: 1.повертати обєкт зі змінами
// 2.перевіряти дані при додаванні по схемі mongoose
export const addUpdateSettings = function (next) {
    this.options.new = true;
    this.options.runValidators = true;
    next();
};
