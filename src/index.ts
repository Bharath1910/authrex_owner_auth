import express, { Express } from 'express';

import { signup } from './routes/signup';
import { login } from './routes/login';

const app: Express = express();
const port = 5000;

app.use(express.json());

app.post('/signup', signup);
app.post('/login', login);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
