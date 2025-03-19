import { Request, Response } from 'express';
import * as textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { google } from '@google-cloud/text-to-speech/build/protos/protos';
import playSound from 'play-sound';

const player = playSound({});

let client: textToSpeech.TextToSpeechClient;

if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    client = new textToSpeech.TextToSpeechClient({ credentials });
  } catch (error) {
    console.error('Error parsing Google Cloud credentials:', error);
    client = new textToSpeech.TextToSpeechClient();
  }
} else {
  client = new textToSpeech.TextToSpeechClient();
}


export const generateSpeech = async (req: Request, res: Response) => {
  try {
    const text = req.query.text as string || 'Hello! This is a text to speech test using Google Cloud.';
    
    
    const audioDir = path.join(__dirname, '../../artifacts/audio');
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
      
      // Play the audio file on the local computer's speakers
      player.play(audioPath, (err) => {
        if (err) {
          console.error('Error playing audio:', err);
        }
      });
      
    } else {
      throw new Error('No audio content received from Google Cloud TTS');
    }
    
    const localAudioPath = audioPath;
    res.json({
      success: true,
      message: 'Speech generated successfully and played on local speakers',
      text,
      audioUrl: localAudioPath,
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate speech', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}; 