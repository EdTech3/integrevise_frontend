import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { DocumentCategory } from '@prisma/client';
import { checkSupportedType, resolveBlobMimeType } from '@/lib/utils/documentFormatParsing';

// TODO: Optimize this route to not accept redundant fields

export async function PATCH(
  request: Request,
) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const submittedFile = formData.get('file') as File | null;
    const originalFileName = formData.get('fileName') as string;
    const originalFilePath = formData.get('filePath') as string;
    const documentId = formData.get('id') as string;

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get existing document to access old file path
    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const isNewFile = submittedFile && (
      originalFileName !== submittedFile.name || 
      existingDocument.filePath !== originalFilePath
    );

    console.log(
      {
        "submittedFile": submittedFile,
        "originalFileName": originalFileName,
        "originalFilePath": originalFilePath,
        "isNewFile": isNewFile
      }
    )

    // Define uniqueFileName at a higher scope
    let uniqueFileName = '';
    
    // If a new file is provided, handle file replacement
    if (isNewFile) {
      const documentType = resolveBlobMimeType(submittedFile);
      const isSupportedType = checkSupportedType(documentType);
      
      if (!isSupportedType) {
        return NextResponse.json(
          { error: 'Unsupported file type' },
          { status: 400 }
        );
      }

      // Delete old file from storage if it exists
      if (existingDocument.filePath) {
        console.log("Deleting old file:", existingDocument.filePath)
        const { data: deleteData, error: deleteError } = await supabase
          .storage
          .from('documents')
          .remove([existingDocument.filePath.trim()]);

        console.log("Deleted data:", deleteData)

        if (deleteError) {
          console.error('Error deleting old file:', deleteError);
        }
      }

      // Delete associated chunks
      await prisma.documentChunk.deleteMany({
        where: { documentId }
      });

      // Upload new file
      uniqueFileName = `${crypto.randomUUID()}-${submittedFile.name}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('documents')
        .upload(uniqueFileName, submittedFile, {
          contentType: submittedFile.type
        });

      if (uploadError) {
        console.error('Supabase storage error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        );
      }

      // Update document with new file info
      await prisma.document.update({
        where: { id: documentId },
        data: {
          filePath: uniqueFileName,
          type: submittedFile ? resolveBlobMimeType(submittedFile) : existingDocument.type,
          status: 'PENDING' // Reset status since new file needs processing
        }
      });

      // Trigger document processing for the new file
      const baseUrl = "http://localhost:3000";
      await fetch(`${baseUrl}/api/document/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify({ documentId }),
      });
    }

    // Update document metadata
  await prisma.document.update({
      where: { id: documentId },
      data: {
        title,
        description,
        category: category as DocumentCategory,
        fileName: submittedFile?.name || originalFileName,
        filePath: isNewFile ? uniqueFileName : existingDocument.filePath,
        type: submittedFile ? resolveBlobMimeType(submittedFile) : existingDocument.type,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}