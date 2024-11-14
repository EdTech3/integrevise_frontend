import {
    encode,
    decode,
  } from 'gpt-tokenizer/model/gpt-3.5-turbo'
  

export const splitIntoChunks = (text: string, maxTokens: number = 500): string[] => {
  const chunks: string[] = [];
  const tokens = encode(text);
  
  let currentChunk: number[] = [];
  
  for (const token of tokens) {
    if (currentChunk.length >= maxTokens) {
      // Convert tokens back to text and add to chunks
      chunks.push(decode(currentChunk));
      currentChunk = [];
    }
    currentChunk.push(token);
  }
  
  if (currentChunk.length > 0) {
    chunks.push(decode(currentChunk));
  }
  
  return chunks;
};
