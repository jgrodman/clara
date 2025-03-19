import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define valid OpenAI TTS voices
type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'ash' | 'coral' | 'sage';

/**
 * Generate speech from text using OpenAI's text-to-speech API
 */
export const generateSpeech = async (req: Request, res: Response) => {
  try {
    // Get text from request or use default
    const text = req.query.text as string || 'Hello! This is a text to speech test using OpenAI.';
    
    // Define voice options and validate input
    const requestedVoice = req.query.voice as string || 'nova';
    const voice = (
      ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'ash', 'coral', 'sage'].includes(requestedVoice) 
        ? requestedVoice 
        : 'nova'
    ) as OpenAIVoice;
    
    // Make sure the audio directory exists
    const audioDir = path.join(__dirname, '../../public/audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    // Generate unique filename
    const filename = `speech-${Date.now()}.mp3`;
    const audioPath = path.join(audioDir, filename);
    
    // Call OpenAI API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
    });
    
    // Convert to buffer and save to file
    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(audioPath, buffer);
    
    // Send the audio file URL back to the client
    const audioUrl = `/audio/${filename}`;
    res.json({
      success: true,
      message: 'Speech generated successfully',
      text,
      voice,
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