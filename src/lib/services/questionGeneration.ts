import { Question } from '@/types/api';
import { DocumentCategory } from '@prisma/client';
import { openai } from './openAIService';

interface FormattedChunk {
  content: string;
  documentCategory: DocumentCategory;
}

export function formatChunksForContext(chunks: FormattedChunk[]) {
  const categoryLabels = {
    STUDENT_WORK: "Student's Work",
    ASSESSMENT_BRIEF: "Assessment Requirements",
    COURSE_MATERIAL: "Course Material",
    TEACHER_NOTES: "Teaching Notes",
    OTHER: "Additional Context"
  };

  return chunks
    .map(chunk => `[${categoryLabels[chunk.documentCategory]}]\n${chunk.content}`)
    .join('\n\n');
}

interface GeneratedQuestionsResponse {
  questions: Question[];    
}

export async function generateQuestions(subjectName: string, studentName: string, formattedContext: string): Promise<GeneratedQuestionsResponse> {
  const completion = await openai.chat.completions.create({
    messages: [{
      role: "system",
      content: `You are an expert academic examiner conducting a viva voice examination for the subject: ${subjectName}.
      
      Conversation Style:
      Maintain two modes of communication:
      - Primary Mode: Professional and academic, used for the formal question structure
      - Friendly Mode: Supportive and encouraging, used for introducing questions and follow-ups
      
        When speaking to ${studentName}:
      - Use a friendly, encouraging tone
      - Keep questions clear and direct
      - Help them feel comfortable
      
      Generate questions that:
      1. Start with the basics before going deeper
      2. Focus on one concept at a time
      3. Let students explain their thinking
      4. Connect to their work when possible
      
      When creating questions:
      - Use simple, everyday language
      - Break complex topics into smaller parts
      - Give examples where helpful
      - Match the assessment goals
      
      Context from various sources:
      ${formattedContext}
      
      Generate 3 questions and return them as a JSON object with the following structure:
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

  return JSON.parse(completion.choices[0].message.content || '{}');
} 