import express, { Request, Response } from 'express';
import { startConversation } from '../conversation';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express API' });
});

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

router.get('/hello', startConversation);

export default router;