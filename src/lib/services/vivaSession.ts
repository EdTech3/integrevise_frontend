import prisma from "../prisma";


export async function getVivaSessionWithDetails(vivaSessionId: string) {
  try {
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
  } catch (error) {
    console.error("Error getting viva session with details", error);
    throw error;
  }
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