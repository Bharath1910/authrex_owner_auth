import express, { Express } from 'express';

import { signup } from './routes/signup';

const app: Express = express();
const port = 5000;

app.use(express.json());

app.post('/signup', signup);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
