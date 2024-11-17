import prisma from "../prisma";


export async function getVivaSessionWithDetails(vivaSessionId: string) {

  const vivaSession = await prisma.vivaSession.findUnique({
    where: { id: vivaSessionId },
    include: {
      documents: true,
      subject: true,
    }
  });

  if (!vivaSession) {
    throw new Error('Viva session not found');
  }

  return vivaSession;
} 

export async function getVivaSessionWithSubjectDetails(vivaSessionId: string) {
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
      throw new Error('Viva session not found');
    }
  
    return vivaSession;
  }