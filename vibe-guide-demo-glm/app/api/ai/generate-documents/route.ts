import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserCredits, updateUserCredits } from '@/lib/auth'
import { generateDocuments } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { description, questions, answers } = await request.json()

    if (!description || !questions || !answers) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Check if user has enough credits
    const credits = await getUserCredits(user.id)
    
    if (credits <= 0) {
      return NextResponse.json({ 
        error: 'Insufficient credits. Please purchase more credits to continue.' 
      }, { status: 402 })
    }

    // Generate documents
    const documents = await generateDocuments({
      description,
      questions,
      answers
    })

    // Deduct one credit
    await updateUserCredits(user.id, credits - 1)

    return NextResponse.json({
      documents
    })
  } catch (error) {
    console.error('Error generating documents:', error)
    return NextResponse.json({ 
      error: 'Failed to generate documents' 
    }, { status: 500 })
  }
}