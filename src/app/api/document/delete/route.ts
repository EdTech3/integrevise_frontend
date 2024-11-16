import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get the document to access the file path
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete file from Supabase storage if it exists
    if (document.filePath) {
      const { error: deleteError } = await supabase
        .storage
        .from('documents')
        .remove([document.filePath]);

      if (deleteError) {
        console.error('Error deleting file from storage:', deleteError);
        return NextResponse.json(
          { error: 'Failed to delete file from storage' },
          { status: 500 }
        );
      }
    }

    // Delete associated chunks
    await prisma.documentChunk.deleteMany({
      where: { documentId }
    });

    // Delete the document record
    await prisma.document.delete({
      where: { id: documentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
