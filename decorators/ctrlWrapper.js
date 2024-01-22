// обгортка, приймає функцію і викликає її
// щоб не повторювати кожен раз конструкцію try-catch

const ctrlWrapper = ctrl => {
    const func= async(req, res, next) => {
        try {
            await ctrl(req, res, next);
        }
        catch(error) {
            next(error);
        }        
    }
    return func;
}

export default ctrlWrapper;
