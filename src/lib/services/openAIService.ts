import { DocumentCategory } from '@prisma/client';
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float"
  });

  return response.data[0].embedding;
}

type WeightedChunk = {
  content: string;
  importance: number | null;
  documentCategory: DocumentCategory;
  similarity: number;
};

export async function getSimilarChunks(
  query: string, 
  vivaSessionId: string, 
  limit: number = 5
) {
  const queryEmbedding = await getEmbedding(
    query || "What are the key points and important concepts discussed?"
  );

  // Simplified query focusing on essential fields
  const chunks: WeightedChunk[] = await prisma.$queryRaw`
    SELECT 
      c.content,
      c.importance,
      d.category as "documentCategory",
      (c.embedding <=> ${queryEmbedding}::vector) as similarity
    FROM "DocumentChunk" c
    JOIN "Document" d ON d.id = c."documentId"
    WHERE d."vivaSessionId" = ${vivaSessionId}
    ORDER BY similarity ASC
    LIMIT ${limit}
  `;

  return chunks;
} 