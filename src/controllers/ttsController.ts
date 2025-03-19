import { Request, Response } from 'express';
import * as textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { google } from '@google-cloud/text-to-speech/build/protos/protos';

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

type GCPVoiceNames = 'en-US-Standard-A' | 'en-US-Standard-B' | 'en-US-Standard-C' | 'en-US-Standard-D' | 'en-US-Standard-E' | 
                     'en-US-Standard-F' | 'en-US-Standard-G' | 'en-US-Standard-H' | 'en-US-Standard-I' | 'en-US-Standard-J' |
                     'en-US-Neural2-A' | 'en-US-Neural2-C' | 'en-US-Neural2-D' | 'en-US-Neural2-E' | 'en-US-Neural2-F' | 
                     'en-US-Neural2-G' | 'en-US-Neural2-H' | 'en-US-Neural2-I' | 'en-US-Neural2-J';

const voiceMapping: Record<string, GCPVoiceNames> = {
  'alloy': 'en-US-Neural2-A',
  'echo': 'en-US-Neural2-C',
  'fable': 'en-US-Neural2-F',
  'onyx': 'en-US-Neural2-D',
  'nova': 'en-US-Neural2-G',
  'shimmer': 'en-US-Neural2-H',
  'ash': 'en-US-Neural2-J',
  'coral': 'en-US-Neural2-E',
  'sage': 'en-US-Neural2-I'
};

export const generateSpeech = async (req: Request, res: Response) => {
  try {
    const text = req.query.text as string || 'Hello! This is a text to speech test using Google Cloud.';
    
    const requestedVoice = req.query.voice as string || 'nova';
    const gcpVoice = voiceMapping[requestedVoice] || 'en-US-Neural2-G';
    
    const audioDir = path.join(__dirname, '../../public/audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const filename = `speech-${Date.now()}.mp3`;
    const audioPath = path.join(audioDir, filename);
    
    const request: google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text },
      voice: {
        name: gcpVoice,
        languageCode: 'en-US',
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };
    
    const [response] = await client.synthesizeSpeech(request);
    
    if (response.audioContent) {
      fs.writeFileSync(audioPath, response.audioContent as Buffer);
    } else {
      throw new Error('No audio content received from Google Cloud TTS');
    }
    
    const audioUrl = `/audio/${filename}`;
    res.json({
      success: true,
      message: 'Speech generated successfully',
      text,
      voice: gcpVoice,
      audioUrl,
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