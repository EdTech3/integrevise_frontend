// src/app/api/key/route.ts

import { createClient } from '@deepgram/sdk';
import { NextResponse } from 'next/server';

export async function GET() {
  const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

  if (!DEEPGRAM_API_KEY) {
    return NextResponse.json({ error: 'DEEPGRAM_API_KEY not set' }, { status: 500 });
  }

  const client = createClient(DEEPGRAM_API_KEY);

  const getProjectId = async () => {
    const {result, error}= await client.manage.getProjects();

    if(error){
        throw error
    }

    return result.projects[0].project_id
  };

  const getTempApiKey = async (projectId: string) => {
    const {result, error} = await client.manage.createProjectKey(projectId, {
      comment: 'short lived',
      scopes: ['usage:write'],
      timeToLive: 20,
    });

    if(error){
        throw error
    }

    return result
  };

  try {
    const projectId = await getProjectId();
    const tempApiKey = await getTempApiKey(projectId);

    return NextResponse.json({ key: tempApiKey });
  } catch (error: any) {
    console.error(error);
    
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}