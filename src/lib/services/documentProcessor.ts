import { supabase } from '../supabase'
import { splitIntoChunks } from '../utils/documentProcessing'
import { getEmbedding } from './openAIService'
import { encode } from 'gpt-tokenizer/model/gpt-3.5-turbo'
import { Document, DocumentType } from '@prisma/client'
import mammoth from 'mammoth'
import PDFParser from 'pdf2json'
import prisma from '../prisma'

async function parseBlob(blob: Blob, type: DocumentType): Promise<string> {
  console.log("Parsing blob:", blob, "Type:", type); 
  try {
    switch (type) {
      case 'WORD':
        const arrayBuffer = await blob.arrayBuffer();
        const result = await mammoth.extractRawText({
          buffer: Buffer.from(arrayBuffer)
        });
        return result.value;

      case 'TEXT':
        return await blob.text();

      case 'PDF':
        // Convert blob to ArrayBuffer
        const pdfArrayBuffer = await blob.arrayBuffer();
        // Convert ArrayBuffer to Buffer
        const pdfBuffer = Buffer.from(pdfArrayBuffer);

        // Use pdf2json to extract text from PDF
        return new Promise((resolve, reject) => {
          const pdfParser = new (PDFParser as any)(null, 1);
          pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
          pdfParser.on('pdfParser_dataReady', () => {
            const parsedText = (pdfParser as any).getRawTextContent();
            resolve(parsedText);
          });

          pdfParser.parseBuffer(pdfBuffer);
        });

      case 'POWERPOINT':
        throw new Error('PowerPoint parsing not implemented yet');

      case 'URL':
        throw new Error('URL parsing should be handled differently');

      default:
        throw new Error(`Unsupported document type: ${type}`);
    }
  } catch (error) {
    console.error('Error parsing document:', error);
    throw new Error(`Failed to parse ${type} document: ${error.message}`);
  }
}

async function getDocumentContent(document: Document): Promise<string> {
  try {
    if (!document.filePath) {
      throw new Error('Document file path is not found');
    }


    const { data, error } = await supabase
      .storage
      .from('documents')
      .download(document.filePath);

    if (error) {
      console.error('Supabase storage error:', {
        error,
        document,
        bucket: 'documents'
      });
      throw error;
    }

    if (!data) {
      throw new Error('No content found');
    }

    // Parse the blob based on document type
    const content = await parseBlob(data, document.type);

    return content

  } catch (error) {
    console.error('Error fetching document content:', error);
    throw new Error(`Failed to fetch document content: ${error.message}`);
  }
}

export async function processDocument(documentId: string) {
  // Fetch document from database
  const document = await prisma.document.findUnique({
    where: { id: documentId }
  });

  if (!document) {
    throw new Error('Document not found');
  }

  try {
    // Update status to processing
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'PROCESSING' }
    });

    // Get document content
    const content = await getDocumentContent(document);
    
    // Split into chunks
    const chunks = splitIntoChunks(content);
    
    // Process each chunk
    for (const chunkContent of chunks) {
      // Get embedding
      const embedding = await getEmbedding(chunkContent);
      
      // Save chunk with embedding using Supabase
      const { error } = await supabase
        .from('DocumentChunk')
        .insert({
          id: crypto.randomUUID(),
          documentId: document.id,
          content: chunkContent,
          importance: 0.5,
          embedding: embedding,
          tokenCount: encode(chunkContent).length,
          updatedAt: new Date().toISOString()
        });

      if (error) {
        console.dir(error);
        throw new Error(`Failed to insert chunk: ${error}`);
      }
    }

    // Update document status to completed
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'COMPLETED' }
    });

  } catch (error) {
    // Update document status to failed
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'FAILED' }
    });
    throw error;
  }
}
