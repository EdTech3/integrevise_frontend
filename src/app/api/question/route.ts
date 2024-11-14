import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getSimilarChunks } from '@/lib/services/openAIService';
import { openai } from '@/lib/services/openAIService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vivaSessionId } = body;
    
    if (!vivaSessionId) {
      return NextResponse.json({ error: 'Viva session ID is required' }, { status: 400 });
    }

    // Get viva session with related document and subject
    const vivaSession = await prisma.vivaSession.findUnique({
      where: { id: vivaSessionId },
      include: {
        documents: true,
        subject: true,
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

    const studentName = "Kelvin";

    const completion = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: `You are an expert academic examiner conducting a viva voice examination for the subject: ${vivaSession.subject.name}.
        
        Conversation Style:
        Maintain two modes of communication:
        - Primary Mode: Professional and academic, used for the formal question structure
        - Friendly Mode: Supportive and encouraging, used for introducing questions and follow-ups
        
        When speaking directly to ${studentName}:
        - Start with friendly encouragement like "That's an interesting point..." or "I'd love to hear your thoughts on..."
        - Use their name occasionally to personalize the interaction
        - Keep a supportive tone while maintaining academic rigor
        - Help them feel comfortable expanding on their ideas
        
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
            "main": "The formal academic version of the question",
            "friendlyVersion": "The same question rephrased in a more conversational, encouraging tone occasionally using the student's name",
            "followUp": ["List of formal follow-up questions to probe deeper understanding"],
            "friendlyFollowUp": ["The follow-up questions rephrased in a more conversational tone"],
            "context": "Specific reference to relevant parts of the provided documents",
            "criteria": "The assessment criteria this question addresses",
            "encouragement": "A supportive phrase to use if the student needs reassurance"
          }]
        }
        
        Ensure each response maintains academic rigor while creating a supportive environment for ${studentName}.`
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
