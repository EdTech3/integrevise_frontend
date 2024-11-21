import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vivaSessionId = searchParams.get('vivaSessionId');

    if (!vivaSessionId) {
      return NextResponse.json({ error: 'Viva session ID is required' }, { status: 400 });
    }

    const { data: documents, error } = await supabase
      .from('Document')
      .select('*')
      .eq('vivaSessionId', vivaSessionId)
      .order('updatedAt', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
