import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { DocumentType } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const {
      file,
      title,
      description,
      category,
      vivaSessionId
    } = await request.json();
    
    if (!file || !title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine document type from file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const documentType = getDocumentType(fileExtension);

    if (!documentType) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Upload file to Supabase storage
    const uniqueFileName = `${crypto.randomUUID()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(uniqueFileName, file, {
        contentType: file.type
      });

    if (uploadError) {
      console.error('Supabase storage error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        title,
        description,
        category,
        type: documentType,
        filePath: uniqueFileName,
        priority: 1,
        isRequired: false,
        status: 'PENDING',
        vivaSessionId
      },
    });

    // Base Url
    const baseUrl = "http://localhost:3000";
    // Trigger document processing
    await fetch(`${baseUrl}/api/document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId: document.id }),
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Error handling document upload:', error);
    return NextResponse.json(
      { error: 'Failed to process document upload' },
      { status: 500 }
    );
  }
}

function getDocumentType(extension?: string): DocumentType | null {
  switch (extension) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
      return 'WORD';
    case 'txt':
      return 'TEXT';
    case 'ppt':
    case 'pptx':
      return 'POWERPOINT';
    default:
      return null;
  }
}
