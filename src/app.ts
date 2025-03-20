import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { startConversation } from './conversation';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

app.get('/api/hello', startConversation);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express API. Use /api for API endpoints.' });
});

interface Error {
  status?: number;
  message?: string;
  stack?: string;
}

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 