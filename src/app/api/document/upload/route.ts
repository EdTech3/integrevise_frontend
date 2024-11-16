import { supabase } from '@/lib/supabase';
import { checkSupportedType, resolveBlobMimeType } from '@/lib/utils/documentFormatParsing';
import { DocumentCategory, DocumentType } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const vivaSessionId = formData.get('vivaSessionId') as string;

    if (!file || !title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }


    const documentType = resolveBlobMimeType(file)
    const isSupportedType = checkSupportedType(documentType)
    
    if (!isSupportedType) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Upload file to Supabase storage
    const uniqueFileName = `${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase
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

    console.log("Document to create:", {
      title,
      category: category as DocumentCategory,
      type: documentType as DocumentType,
      description,
      filePath: uniqueFileName,
      fileName: file.name,
      vivaSessionId,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 1,
      isRequired: false,
      status: 'PENDING'
    })

    // Create document record in database using Supabase
    const document = await prisma.document.create({
      data: {
        title,
        category,
        type: documentType,
        description,
        filePath: uniqueFileName,
        fileName: file.name,
        priority: 1,
        isRequired: false,
        status: 'PENDING',
        vivaSessionId,
      }
    });

    console.log("Document created:", document)

    // Base Url
    const baseUrl = "http://localhost:3000";
    // Trigger document processing
    await fetch(`${baseUrl}/api/document/process`, {
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
