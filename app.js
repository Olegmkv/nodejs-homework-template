import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import "dotenv/config";
import authRouter from './routes/api/auth.js';
import contactsRouter from './routes/api/contacts.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
// дозвіл на міждоменні запити 
app.use(cors());
// парсер json
app.use(express.json());
// дозвіл отримувати статичні файли
app.use(express.static("public"));
// endpoint оброблюються у відповідних роутерах
app.use('/api/users', authRouter);
app.use('/api/contacts', contactsRouter);
// обробка відсутнього маршруту 
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
})
// обробка помилки
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;


