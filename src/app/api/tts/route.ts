import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

// Initialize the Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Make a request to Deepgram's text-to-speech API
    const response = await deepgram.speak.request(
      { text },
      {
        model: 'aura-athena-en',
        encoding: 'linear16',
        container: 'wav',
      }
    );

    // Get the audio stream
    const stream = await response.getStream();

    if (!stream) {
      return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
    }

    // Convert the stream to a buffer
    const chunks: Uint8Array[] = [];
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);

    // Return the audio file as a response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'attachment; filename="speech.wav"',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}