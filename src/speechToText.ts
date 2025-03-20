import fs from 'fs';
import * as speech from '@google-cloud/speech';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Microphone from 'node-microphone';

const audioDir = path.join(process.cwd(), 'artifacts/audio-input');
const speechClient = new speech.SpeechClient();
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

export async function speechToText() {
    const filePath = path.join(audioDir, `recording-${uuidv4()}.wav`);
    console.log('Recording audio...');
    const mic = new Microphone();
    const micStream = mic.startRecording();
    const file = fs.createWriteStream(filePath);
    micStream.pipe(file);
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('Stopping recording');
    mic.stopRecording();

    try {
        const audioBytes = fs.readFileSync(filePath).toString('base64');

        const request: speech.protos.google.cloud.speech.v1.IRecognizeRequest = {
            audio: {
                content: audioBytes
            },
            config: {
                encoding: speech.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
                sampleRateHertz: 16000,
                languageCode: 'en-US'
            }
        };

        const [response] = await speechClient.recognize(request);
        let transcription = '';

        if (response.results && response.results.length > 0) {
            transcription = response.results
                .map(result => result.alternatives && result.alternatives[0].transcript || '')
                .join('\n');
        }

        console.log(`Transcript: ${transcription}`);

        // const record = await base('Conversations').create({
        //     'User Input': transcription || 'No speech detected',
        //     'Timestamp': new Date().toISOString()
        // });

    } catch (error) {
        console.error('Error in speech-to-text:', error);
    }
}