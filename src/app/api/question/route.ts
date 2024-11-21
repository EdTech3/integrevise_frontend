import { getSimilarChunks } from '@/lib/services/openAIService';
import { formatChunksForContext, generateQuestions } from '@/lib/services/questionGeneration';
import { getVivaSessionWithDetails } from '@/lib/services/vivaSession';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

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
const { data: existingQuestions, error } = await supabase
  .from('QuestionAnswer')
  .select('*')
  .eq('vivaSessionId', vivaSessionId);

if (error) {
  throw error;
}

// If questions exist, return them
if (existingQuestions && existingQuestions.length > 0) {
  return NextResponse.json(existingQuestions);
}

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
      id: crypto.randomUUID(), // Generate UUID for id
      question: question.main,
      friendlyQuestion: question.friendlyVersion,
      answer: '', // Empty answer initially
      score: null, // Optional score field
      overallEvaluation: null, // Optional evaluation field
      timestamp: new Date(),
      questionEmbedding: null, // Optional embedding field
      answerEmbedding: null, // Optional embedding field
      vivaSessionId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Bulk insert all questions
    const { error: insertError } = await supabase
      .from('QuestionAnswer')
      .insert(questionsToCreate);

    if (insertError) {
      throw insertError;
    }

    // Fetch the created questions
    const { data: questionAnswers, error: fetchError } = await supabase
      .from('QuestionAnswer')
      .select('*')
      .eq('vivaSessionId', vivaSessionId)
      .order('createdAt', { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    return NextResponse.json(questionAnswers);
    
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
