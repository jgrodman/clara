import express, { Request, Response } from 'express';
import ttsRoutes from './ttsRoutes';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express API' });
});

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

router.use('/tts', ttsRoutes);

export default router; 