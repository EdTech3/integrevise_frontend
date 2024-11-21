import { supabase } from "../supabase";

export async function getVivaSessionWithDetails(vivaSessionId: string) {
  try {
    const { data: vivaSession, error } = await supabase
      .from('VivaSession')
      .select(`
        *,
        documents:Document(*),
        subject:Subject(*)
      `)
      .eq('id', vivaSessionId)
      .single();

    if (error) {
      throw error;
    }

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
  const { data: vivaSession, error } = await supabase
    .from('VivaSession')
    .select(`
      *,
      subject:Subject(
        *,
        subjectCriteria:SubjectCriteria(
          *,
          criteria:Criteria(*)
        )
      )
    `)
    .eq('id', vivaSessionId)
    .single();

  if (error) {
    throw error;
  }

  if (!vivaSession) {
    throw new Error('Viva session not found');
  }

  return vivaSession;
}