import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await requireAuth();
    
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(desc(projects.createdAt));
    
    return NextResponse.json(userProjects);
  } catch (error) {
    console.error('Get projects error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: '获取项目列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const {
      title,
      description,
      requirements,
      userJourneyMap,
      productRequirements,
      frontendDesign,
      backendDesign,
      databaseDesign,
      status = 'completed'
    } = await request.json();
    
    if (!title || !description) {
      return NextResponse.json(
        { error: '标题和描述不能为空' },
        { status: 400 }
      );
    }

    const [project] = await db
      .insert(projects)
      .values({
        userId: user.id,
        title,
        description,
        requirements,
        userJourneyMap,
        productRequirements,
        frontendDesign,
        backendDesign,
        databaseDesign,
        status,
      })
      .returning();
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Create project error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: '创建项目失败' },
      { status: 500 }
    );
  }
}