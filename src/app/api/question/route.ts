import { NextResponse } from 'next/server';
import { getSimilarChunks } from '@/lib/services/openAIService';
import { getVivaSessionWithDetails } from '@/lib/services/vivaSession';
import { formatChunksForContext, generateQuestions } from '@/lib/services/questionGeneration';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vivaSessionId = searchParams.get('vivaSessionId');

    if (!vivaSessionId) {
      return NextResponse.json({ error: 'Viva session ID is required' }, { status: 400 });
    }
    
    // Get viva session details
    const vivaSession = await getVivaSessionWithDetails(vivaSessionId);

    // Get relevant chunks with enhanced context retrieval
    const relevantChunks = await getSimilarChunks(
      "What are the key concepts, methodologies, and findings in this work?",
      vivaSessionId,
      10,
    );

    // Format context
    const formattedContext = formatChunksForContext(relevantChunks);

    // Generate questions
    const questions = await generateQuestions(
      vivaSession.subject.name,
      "Kelvin", // TODO: Get this from the session or user profile
      formattedContext
    );

    return NextResponse.json(questions);
    
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
