import { Request, Response } from 'express';
import * as tts from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { google } from '@google-cloud/text-to-speech/build/protos/protos';
import playSound from 'play-sound';
import logger from './logger';

const player = playSound({});

const client = new tts.TextToSpeechClient();

export const textToSpeech = async (text: string) => {
  logger.info("Agent: " + text);
  try {
    const audioDir = path.join(__dirname, '../../artifacts/audio-output');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const filename = `speech-${Date.now()}.mp3`;
    const audioPath = path.join(audioDir, filename);

    const request: google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text },
      voice: {
        languageCode: 'en-US',
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    if (response.audioContent) {
      fs.writeFileSync(audioPath, response.audioContent as Buffer);

      await new Promise<void>((resolve, reject) => {
        player.play(audioPath, (err) => {
          if (err) {
            logger.error('Error playing audio:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });

    } else {
      throw new Error('No audio content received from Google Cloud TTS');
    }
  } catch (error) {
    logger.error('Error generating speech:', error);
  }
}; 