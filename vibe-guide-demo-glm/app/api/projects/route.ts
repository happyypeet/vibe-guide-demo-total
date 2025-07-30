import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { projects, projectSteps, projectDocuments } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, steps, documents } = await request.json()

    if (!title || !description || !steps) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Create project
    const [newProject] = await db.insert(projects).values({
      userId: user.id,
      title,
      description,
      status: 'completed'
    }).returning()

    // Create project steps
    for (const step of steps) {
      await db.insert(projectSteps).values({
        projectId: newProject.id,
        step: step.step,
        content: step.content,
        isCompleted: true
      })
    }

    // Create project documents
    for (const doc of documents) {
      await db.insert(projectDocuments).values({
        projectId: newProject.id,
        type: doc.type,
        title: doc.title,
        content: doc.content
      })
    }

    return NextResponse.json({
      projectId: newProject.id,
      message: 'Project created successfully'
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ 
      error: 'Failed to create project' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userProjects = await db.query.projects.findMany({
      where: eq(projects.userId, user.id),
      orderBy: [desc(projects.createdAt)]
    })

    return NextResponse.json({
      projects: userProjects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch projects' 
    }, { status: 500 })
  }
}