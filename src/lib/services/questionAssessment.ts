import { DocumentCategory } from "@prisma/client";
import { openai } from "./openAIService";

interface VivaSessionWithCriteria {
    subject: {
      name: string;
      subjectCriteria: Array<{
        criteriaId: string;
        criteria: {
          name: string;
          description: string;
        };
        weight: number;
      }>;
    };
}

interface WeightedChunk {
    content: string;
    importance: number | null;
    documentCategory: DocumentCategory;
    similarity: number;
    priorityScore: number;
  };

interface AssessmentCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export function formatAssessmentContext(chunks: WeightedChunk[]) {
    return chunks
      .map(chunk => `[${chunk.documentCategory}]\n${chunk.content}`)
      .join('\n\n');
  }
  
export function prepareCriteriaList(vivaSession: VivaSessionWithCriteria) {
    return vivaSession.subject.subjectCriteria
      .map(sc => ({
        id: sc.criteriaId,
        name: sc.criteria.name,
        description: sc.criteria.description,
        weight: sc.weight
      }));
  }
  


export async function performAssessment(
    subjectName: string,
    question: string,
    answer: string,
    formattedContext: string,
    criteriaList: AssessmentCriteria[]
  ) {
    const completion = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: `You are an expert academic assessor evaluating a student's answer in ${subjectName}.
  
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
  
    return JSON.parse(completion.choices[0].message.content || '{}');
  }