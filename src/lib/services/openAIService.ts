import OpenAI from 'openai';

const openai = new OpenAI({
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

export async function getSimilarChunks(query: string, vivaSessionId: string, limit: number = 5) {
  // Get embedding for query
  const queryEmbedding = await getEmbedding(query);

  // Find similar chunks using vector similarity
  const similarChunks = await prisma.$queryRaw`
    SELECT c.content, c.id,
      (c.embedding <=> ${queryEmbedding}::vector) as similarity
    FROM "DocumentChunk" c
    JOIN "Document" d ON d.id = c."documentId"
    WHERE d."vivaSessionId" = ${vivaSessionId}
    ORDER BY similarity ASC
    LIMIT ${limit}
  `;

  return similarChunks;
} 