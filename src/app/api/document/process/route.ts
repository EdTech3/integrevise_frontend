import { NextResponse } from 'next/server'
import { processDocument } from '../../../../lib/services/documentProcessor';

export async function POST(request: Request) {
  try {
    // Get documentId from URL parameters
    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    await processDocument(documentId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}


