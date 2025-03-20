import { Request, Response } from 'express';
import Airtable from 'airtable';
import { generateSpeech } from './tts';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as speech from '@google-cloud/speech';
import { protos } from '@google-cloud/speech';

// Configure Airtable
// const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID || '');

// Initialize Google Cloud Speech client
const speechClient = new speech.SpeechClient();

export const startConversation = async (req: Request, res: Response) => {
    try {
        const initialText = "Hello, I am hal";
        await generateSpeech(initialText);

        const audioDir = path.join(process.cwd(), 'artifacts/audio-input');
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }

        const fileName = `recording-${uuidv4()}.wav`;
        const filePath = path.join(audioDir, fileName);

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Transfer-Encoding': 'chunked'
        });
        res.write(JSON.stringify({
            status: 'recording',
            message: 'Started recording. Please speak now...'
        }));

        console.log('Recording audio...');
        // Import and initialize the recorder
        const Microphone = require('node-microphone');
        const mic = new Microphone();
        const micStream = mic.startRecording();
        const file = fs.createWriteStream(filePath);
        micStream.pipe(file);

        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('Stopping recording');
        mic.stopRecording();



        // setTimeout(async () => {
        //     console.log('Stopping recording');
        //     recording.stop();

        //     console.log('Converting speech to text...');
        //     try {
        //         const audioBytes = fs.readFileSync(filePath).toString('base64');

        //         const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
        //             audio: {
        //                 content: audioBytes
        //             },
        //             config: {
        //                 encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
        //                 sampleRateHertz: 16000,
        //                 languageCode: 'en-US'
        //             }
        //         };

        //         const [response] = await speechClient.recognize(request);
        //         let transcription = '';

        //         if (response.results && response.results.length > 0) {
        //             transcription = response.results
        //                 .map(result => result.alternatives && result.alternatives[0].transcript || '')
        //                 .join('\n');
        //         }

        //         console.log(`Transcript: ${transcription}`);

        //         // const record = await base('Conversations').create({
        //         //     'User Input': transcription || 'No speech detected',
        //         //     'Timestamp': new Date().toISOString()
        //         // });

        //         res.write(JSON.stringify({
        //             success: true,
        //             message: 'Conversation completed',
        //             initialPrompt: initialText,
        //             transcript: transcription || 'No speech detected',
        //             // airtableRecordId: record.getId()
        //         }));

        //         res.end();
        //     } catch (error) {
        //         console.error('Error in speech-to-text:', error);
        //         res.write(JSON.stringify({
        //             success: false,
        //             message: 'Error processing speech',
        //             error: error instanceof Error ? error.message : 'Unknown error'
        //         }));
        //         res.end();
        //     }
        // }, 5000);

    } catch (error) {
        console.error('Error starting conversation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start conversation',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};