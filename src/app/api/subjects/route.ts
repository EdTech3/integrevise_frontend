import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'


export async function GET() {
  try {
    const subjects = await prisma.subject.findMany()
    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Request error', error)
    return NextResponse.json({ error: 'Error fetching subjects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const subject = await prisma.subject.create({
      data: json,
    })
    return NextResponse.json(subject)
  } catch (error) {
    console.error('Request error', error)
    return NextResponse.json({ error: 'Error creating subject' }, { status: 500 })
  }
}
