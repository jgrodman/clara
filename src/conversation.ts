import { Request, Response } from 'express';
import Airtable from 'airtable';
import { textToSpeech } from './textToSpeech';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { speechToText } from './speechToText';
// Configure Airtable
// const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID || '');

// Initialize Google Cloud Speech client

export const startConversation = async (req: Request, res: Response) => {
    try {
        const initialText = "Hello, I am hal";
        res.send("Initiating conversation")
        await textToSpeech(initialText);

        const audioDir = path.join(process.cwd(), 'artifacts/audio-input');
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }

        await speechToText();
    } catch (error) {
        console.error('Error starting conversation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start conversation',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};