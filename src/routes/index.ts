import express, { Request, Response } from 'express';
import userRoutes from './userRoutes';

const router = express.Router();

// Root route
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express API' });
});

// Health check route
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

// User routes
router.use('/users', userRoutes);

export default router; 