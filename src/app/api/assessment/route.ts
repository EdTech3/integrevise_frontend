import prisma from '@/lib/prisma';
import { getSimilarChunks } from '@/lib/services/openAIService';
import { formatAssessmentContext, performAssessment, prepareCriteriaList } from '@/lib/services/questionAssessment';
import { getVivaSessionWithSubjectDetails } from '@/lib/services/vivaSession';
import { AssessmentRequest } from '@/types/api';
import { Criteria } from '@prisma/client';
import { NextResponse } from 'next/server';


interface Assessment {
  overallEvaluation: string;
  assessments: {
    criteriaId: string;
    score: number;
    evidence: string;
    feedback: string;
  }[];
  suggestedFollowUp: string[];
}


export async function POST(request: Request) {
  try {
    const body: AssessmentRequest = await request.json();
    const { vivaSessionId, question, answer } = body;
    
    if (!vivaSessionId || !question || !answer) {
      return NextResponse.json({ 
        error: 'Viva session ID, question, and answer are required' 
      }, { status: 400 });
    }

    // Get session details and validate
    const vivaSession = await getVivaSessionWithSubjectDetails(vivaSessionId);
    const criteriaList: Criteria[] = await prisma.criteria.findMany()


    // Get relevant context for assessment
    const relevantChunks = await getSimilarChunks(
      `Question: ${question.text} \nAnswer: ${answer}`,
      vivaSessionId,
      5,
      2500
    );

    // Format context and prepare criteria
    const formattedContext = formatAssessmentContext(relevantChunks);
    const subjectCriteriaList = prepareCriteriaList(vivaSession);

    // Check if question is already assessed
    const isQuestionAssessed = await prisma.questionAnswer.findUnique({
      where: { id: question.id }
    })

    if(!isQuestionAssessed) {
      return NextResponse.json({success: false, message: "Question not found"}, {status: 404});
    }

    if (isQuestionAssessed?.answer) {
      return NextResponse.json({success: true, message: "Question already have an answer"}, {status: 200});
    }

    // Perform assessment
    const assessment: Assessment = await performAssessment(
      vivaSession.subject.name,
      question.text,
      answer,
      formattedContext,
      subjectCriteriaList
    );


    // Update answer in to corresponding question
    await prisma.questionAnswer.update({
      where:{id: question.id},
      data: {
        answer,
        overallEvaluation: assessment.overallEvaluation
      }
    })

    // update question answer criteria
    const updatedCriteria = assessment.assessments.map((assessment) => {
      const criteria = criteriaList.find((criteria) => criteria.name.toLocaleLowerCase() === assessment.criteriaId.toLocaleLowerCase())

      return {
      questionAnswerId: question.id,
      criteriaId: criteria?.id,
      score: assessment.score,
      evaluation: assessment.evidence
    }})

    console.log("Updated Criteria: -> \n", updatedCriteria)

    await prisma.questionAnswerCriteria.createMany({
      data: updatedCriteria
    })

    return NextResponse.json({success: true, message: "Answer Recorded Successfully"}, {status: 200});
    
  } catch (error) {
    console.error('Error assessing answer:', error);
    return NextResponse.json(
      { error: 'Failed to assess answer' },
      { status: 500 }
    );
  }
} 