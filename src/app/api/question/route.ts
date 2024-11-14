import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getSimilarChunks } from '@/lib/services/openAIService';
import { openai } from '@/lib/services/openAIService';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vivaSessionId = searchParams.get('vivaSessionId');
    
    if (!vivaSessionId) {
      return NextResponse.json({ error: 'Viva session ID is required' }, { status: 400 });
    }

    // Get viva session with related document and subject
    const vivaSession = await prisma.vivaSession.findUnique({
      where: { id: vivaSessionId },
      include: {
        documents: true,
        subject: true
      }
    });

    if (!vivaSession) {
      return NextResponse.json({ error: 'Viva session not found' }, { status: 404 });
    }

    // Get relevant document chunks using vector similarity
    const relevantChunks = await getSimilarChunks("", vivaSessionId, 10);


    const completion = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: `You are an expert academic examiner conducting a viva voice examination for the subject: ${vivaSession.subject.name}.
        
        Generate 5 questions and return them as a JSON object based on the following context from the student's submitted work. The questions should:
        1. Test deep understanding rather than surface-level knowledge
        2. Follow a logical progression from fundamental concepts to advanced applications
        3. Include follow-up prompts to explore the student's reasoning
        4. Reference specific parts of their work where relevant
        5. Align with academic assessment criteria
        
        Context from student's work:
        ${relevantChunks.map(chunk => chunk.content).join('\n')}
        `
      }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const questions = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(questions);
    
   } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
