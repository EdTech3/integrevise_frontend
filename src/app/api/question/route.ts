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

    // Get relevant chunks with enhanced context retrieval
    const relevantChunks = await getSimilarChunks(
      "What are the key concepts, methodologies, and findings in this work?",
      vivaSessionId,
      10,
    );

    console.log("First chunk:", relevantChunks[0].content);

    // Format chunks by category for better context
    const formattedContext = relevantChunks
      .map(chunk => {
        const categoryLabel = {
          STUDENT_WORK: "Student's Work",
          ASSESSMENT_BRIEF: "Assessment Requirements",
          COURSE_MATERIAL: "Course Material",
          TEACHER_NOTES: "Teaching Notes",
          OTHER: "Additional Context"
        }[chunk.documentCategory];

        return `[${categoryLabel}]\n${chunk.content}`;
      })
      .join('\n\n');

      console.log("Formatted Context", formattedContext)

    const completion = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: `You are an expert academic examiner conducting a viva voice examination for the subject: ${vivaSession.subject.name}.
        
        You have access to different types of documents, clearly marked with their source category. Use this context to generate questions that:
        1. Test deep understanding rather than surface-level knowledge
        2. Follow a logical progression from fundamental concepts to advanced applications
        3. Include follow-up prompts to explore the student's reasoning
        4. Reference specific parts of their work where relevant
        5. Align with the assessment criteria provided
        
        When generating questions:
        - Focus primarily on content from [Student's Work]
        - Ensure questions align with [Assessment Requirements]
        - Use [Course Material] and [Teaching Notes] to provide additional context
        
        Context from various sources:
        ${formattedContext}
        
        Generate 5 questions and return them as a JSON object with the following structure:
        {
          "questions": [{
            "main": "The primary question text",
            "followUp": ["Related follow-up questions"],
            "context": "Reference to specific part of student's work",
            "criteria": "Related assessment criteria"
          }]
        }
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
