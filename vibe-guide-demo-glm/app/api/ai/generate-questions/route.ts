import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserCredits, updateUserCredits } from '@/lib/auth'
import { generateQuestions } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectDescription } = await request.json()

    if (!projectDescription || projectDescription.length < 20) {
      return NextResponse.json({ 
        error: 'Project description must be at least 20 characters long' 
      }, { status: 400 })
    }

    const questions = await generateQuestions(projectDescription)

    return NextResponse.json({
      questions: questions.map(q => ({
        question: q.question,
        type: q.type
      }))
    })
  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json({ 
      error: 'Failed to generate questions' 
    }, { status: 500 })
  }
}