import { NextResponse } from 'next/server';
import { getSimilarChunks } from '@/lib/services/openAIService';
import { getVivaSessionWithDetails } from '@/lib/services/vivaSession';
import { formatChunksForContext, generateQuestions } from '@/lib/services/questionGeneration';
import prisma from '@/lib/prisma';

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

    // Try to get questions from the database
    const existingQuestions = await prisma.questionAnswer.findMany({
      where:{
        vivaSessionId
      }
    });

    // If questions exist, return them
    if (existingQuestions.length > 0) {
      return NextResponse.json(existingQuestions);
    }

    // Generate questions
    const {questions} = await generateQuestions(
      vivaSession.subject.name,
      "Kelvin", // TODO: Get this from the session or user profile
      formattedContext
    );


    // Format questions for bulk insert
    const questionsToCreate = questions.map(question => ({
      question: question.main,
      friendlyQuestion: question.friendlyVersion,
      answer: '', // Empty answer initially
      vivaSessionId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Bulk insert all questions
    const questionAnswers = await prisma.questionAnswer.createMany({
      data: questionsToCreate
    });

    return NextResponse.json(questionAnswers);
    
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
