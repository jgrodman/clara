import { Request, Response } from 'express';
import { textToSpeech } from './textToSpeech';
import fs from 'fs';
import path from 'path';
import { speechToText } from './speechToText';
import { createTable, insertData } from './airtable';

export const startConversation = async (req: Request, res: Response) => {
    try {
        const initialText = "Hello, I am hal";
        res.send("Initiating conversation")
        await textToSpeech(initialText);

        const audioDir = path.join(process.cwd(), 'artifacts/audio-input');
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }

        const text = await speechToText();

        const tableName = await createTable()
        await insertData(tableName, text)
    } catch (error) {
        console.error(error);
    }
};