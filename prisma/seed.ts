/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // Create Subjects
    const machineLearning = await prisma.subject.create({
      data: {
        name: 'Machine Learning',
        code: 'CS401',
        description: 'Introduction to Machine Learning and AI concepts',
        metadata: {
          level: 'undergraduate',
          credits: 3
        }
      }
    })

    const webDevelopment = await prisma.subject.create({
      data: {
        name: 'Web Development',
        code: 'CS301',
        description: 'Modern web development techniques and practices',
        metadata: {
          level: 'undergraduate',
          credits: 3
        }
      }
    })

    // Create Criteria
    const relevanceCriteria = await prisma.criteria.create({
      data: {
        name: 'Relevance',
        description: 'How relevant the answer is to the question asked',
        defaultWeight: 0.4
      }
    })

    const clarityCriteria = await prisma.criteria.create({
      data: {
        name: 'Clarity',
        description: 'How clear and well-structured the answer is',
        defaultWeight: 0.3
      }
    })

    const technicalCriteria = await prisma.criteria.create({
      data: {
        name: 'Technical Accuracy',
        description: 'The technical accuracy and depth of the answer',
        defaultWeight: 0.3
      }
    })

    // Create Subject Criteria Associations
    await prisma.subjectCriteria.createMany({
      data: [
        {
          subjectId: machineLearning.id,
          criteriaId: relevanceCriteria.id,
          weight: 0.4
        },
        {
          subjectId: machineLearning.id,
          criteriaId: clarityCriteria.id,
          weight: 0.3
        },
        {
          subjectId: machineLearning.id,
          criteriaId: technicalCriteria.id,
          weight: 0.3
        },
        {
          subjectId: webDevelopment.id,
          criteriaId: relevanceCriteria.id,
          weight: 0.4
        },
        {
          subjectId: webDevelopment.id,
          criteriaId: clarityCriteria.id,
          weight: 0.3
        },
        {
          subjectId: webDevelopment.id,
          criteriaId: technicalCriteria.id,
          weight: 0.3
        }
      ]
    })

    // Create Test User
    const testUser = await prisma.user.create({
      data: {
        auth_id: 'auth0|test123',
        email: 'test@example.com',
        fullName: 'Test Student',
        studentId: 'STU001',
        department: 'Computer Science',
        role: 'STUDENT'
      }
    })

    // Create a Viva Session
    const vivaSession = await prisma.vivaSession.create({
      data: {
        userId: testUser.id,
        subjectId: machineLearning.id,
        startTime: new Date(),
        status: 'IN_PROGRESS',
        facialRecognitionStatus: true
      }
    })

    // Create Question Answers
    const questionAnswer = await prisma.questionAnswer.create({
      data: {
        vivaSessionId: vivaSession.id,
        question: 'What is supervised learning?',
        friendlyQuestion: 'Can you explain what supervised learning is and how it works?',
        answer: 'Supervised learning is a type of machine learning where the model learns from labeled data...',
        score: 0.85
      }
    })

    // Create Question Answer Criteria
    await prisma.questionAnswerCriteria.createMany({
      data: [
        {
          questionAnswerId: questionAnswer.id,
          criteriaId: relevanceCriteria.id,
          score: 0.9,
          evaluation: 'The answer directly addresses the concept of supervised learning'
        },
        {
          questionAnswerId: questionAnswer.id,
          criteriaId: clarityCriteria.id,
          score: 0.8,
          evaluation: 'The explanation is clear and well-structured'
        }
      ]
    })

    // Create test Documents with corrected categories
    const assessmentBrief = await prisma.document.create({
      data: {
        title: 'Advanced Mobile Computing Assignment',
        type: 'WORD',
        category: 'ASSESSMENT_BRIEF',
        priority: 2,
        isRequired: true,
        filePath: 'IS3S664_2324_CW1M.docx',
        url: 'https://rnfuxprqrbfupmebbjwk.supabase.co/storage/v1/object/public/documents/IS3S664_2324_CW1M.docx',
        status: 'COMPLETED',
        metadata: {
          pageCount: 10,
          wordCount: 2500,
          fileSize: '1.2MB'
        },
        vivaSessionId: vivaSession.id
      }
    });

    const studentSubmission = await prisma.document.create({
      data: {
        title: 'Mobile Computing Assignment Brief',
        type: 'PDF',
        category: 'STUDENT_WORK',
        priority: 3,
        isRequired: true,
        filePath: 'IS3S664_brief.pdf',
        url: 'https://rnfuxprqrbfupmebbjwk.supabase.co/storage/v1/object/public/documents/IS3S664_brief.pdf',
        status: 'COMPLETED',
        metadata: {
          pageCount: 3,
          wordCount: 800,
          fileSize: '500KB'
        },
        vivaSessionId: vivaSession.id
      }
    });

    console.log('Database has been seeded! 🌱')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    // Disconnect Prisma Client
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
