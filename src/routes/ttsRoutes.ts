import express from 'express';
import * as ttsController from '../controllers/ttsController';

const router = express.Router();

// Generate speech from text
router.get('/hello', ttsController.generateSpeech);

export default router; 