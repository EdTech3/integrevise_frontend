import { DocumentCategory } from '@prisma/client';
import OpenAI from 'openai';
import { encode } from 'gpt-tokenizer/model/gpt-3.5-turbo';
import prisma from '../prisma';

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
  priorityScore: number;
};

export async function getSimilarChunks(
  query: string, 
  vivaSessionId: string, 
  limit: number = 5,
  maxTokens: number = 2500
) {
  const queryEmbedding = await getEmbedding(
    query || "What are the key points and important concepts discussed?"
  );

  // Get more chunks than needed to account for token filtering
  const initialLimit =5 // Get more chunks initially

  const chunks: WeightedChunk[] = await prisma.$queryRaw`
    SELECT 
      c.content,
      c.importance,
      d.category as "documentCategory",
      (c.embedding <=> ${queryEmbedding}::vector) as similarity,
      (
        (1 - (c.embedding <=> ${queryEmbedding}::vector)) * 
        CASE d.category
          WHEN 'STUDENT_WORK' THEN 3.0
          WHEN 'ASSESSMENT_BRIEF' THEN 2.5
          WHEN 'COURSE_MATERIAL' THEN 1.5
          WHEN 'TEACHER_NOTES' THEN 1.2
          ELSE 1.0
        END
      ) as "priorityScore"
    FROM "DocumentChunk" c
    JOIN "Document" d ON d.id = c."documentId"
    WHERE d."vivaSessionId" = ${vivaSessionId}
    ORDER BY "priorityScore" DESC
    LIMIT ${initialLimit}
  `;

  // Filter chunks based on token count
  let totalTokens = 0;
  const filteredChunks = [];

  for (const chunk of chunks) {
    const chunkTokens = encode(chunk.content).length;
    if (totalTokens + chunkTokens <= maxTokens) {
      filteredChunks.push(chunk);
      totalTokens += chunkTokens;
    }
    if (filteredChunks.length >= limit || totalTokens >= maxTokens) {
      break;
    }
  }

  return filteredChunks;
} 