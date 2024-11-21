import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: subjects, error } = await supabase
      .from('Subject')
      .select('*')
      .order('name')

    if (error) {
      throw error
    }

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Request error', error)
    return NextResponse.json({ error: 'Error fetching subjects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    
    const { data: subject, error } = await supabase
      .from('Subject')
      .insert([json])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(subject)
  } catch (error) {
    console.error('Request error', error)
    return NextResponse.json({ error: 'Error creating subject' }, { status: 500 })
  }
}
