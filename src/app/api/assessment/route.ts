import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { openai } from '@/lib/services/openAIService';
import { getSimilarChunks } from '@/lib/services/openAIService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      vivaSessionId,
      question,    // The question being answered
      answer,      // Student's answer
    } = body;
    
    if (!vivaSessionId || !question || !answer) {
      return NextResponse.json({ 
        error: 'Viva session ID, question, and answer are required' 
      }, { status: 400 });
    }

    // Get viva session with subject and criteria
    const vivaSession = await prisma.vivaSession.findUnique({
      where: { id: vivaSessionId },
      include: {
        subject: {
          include: {
            subjectCriteria: {
              include: {
                criteria: true
              }
            }
          }
        }
      }
    });

    if (!vivaSession) {
      return NextResponse.json({ error: 'Viva session not found' }, { status: 404 });
    }

    // Get relevant context for assessment
    const relevantChunks = await getSimilarChunks(
      `Question: ${question} \nAnswer: ${answer}`, // Include both question and answer for better context
      vivaSessionId,
      5,
      2500 // Token limit
    );

    // Format context
    const formattedContext = relevantChunks
      .map(chunk => `[${chunk.documentCategory}]\n${chunk.content}`)
      .join('\n\n');

    // Prepare criteria for assessment
    const criteriaList = vivaSession.subject.subjectCriteria
      .map(sc => ({
        id: sc.criteriaId,
        name: sc.criteria.name,
        description: sc.criteria.description,
        weight: sc.weight
      }));

    const completion = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: `You are an expert academic assessor evaluating a student's answer in ${vivaSession.subject.name}.

        When generating answers from the [Student Work]:
        - Focus primarily on content from [Assessment Brief]
        - Ensure questions align with [Assessment Requirements]
        - Use [Course Material] and [Teaching Notes] to provide additional context
        
        Question: ${question}
        Student's Answer: ${answer}
        
        Reference Materials:
        ${formattedContext}
        
        Assessment Criteria:
        ${criteriaList.map(c => `- ${c.name}: ${c.description} (Weight: ${c.weight})`).join('\n')}
        
        Evaluate the answer based on each criterion. For each criterion:
        1. Assign a score between 0 and 1 (where 1 is perfect)
        2. Provide specific evidence from the answer to justify the score
        3. Give constructive feedback for improvement
        
        Return your assessment as a JSON object with this structure:
        {
          "overallEvaluation": "Comprehensive evaluation of the answer's strengths and weaknesses",
          "assessments": [{
            "criteriaId": "string",
            "score": number,
            "evidence": "Specific examples from the answer that justify the score",
            "feedback": "Constructive suggestions for improvement"
          }],
          "suggestedFollowUp": ["List of follow-up questions to clarify or expand on weak points"]
        }`
      }],
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const assessment = JSON.parse(completion.choices[0].message.content || '{}');

 

    // Add overall score to response
    const response = {
      ...assessment
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error assessing answer:', error);
    return NextResponse.json(
      { error: 'Failed to assess answer' },
      { status: 500 }
    );
  }
} 