import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(projects.createdAt);

    return NextResponse.json(userProjects);
  } catch (error) {
    console.error("获取项目失败:", error);
    return NextResponse.json({ error: "获取项目失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, detailedRequirements, aiQuestions, userAnswers, documents, isCompleted } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "标题和描述不能为空" }, { status: 400 });
    }

    const [userRecord] = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id));

    if (userRecord && userRecord.projectPoints <= 0) {
      return NextResponse.json({ error: "项目点数不足" }, { status: 400 });
    }

    const project = await db
      .insert(projects)
      .values({
        userId: user.id,
        title,
        description,
        detailedRequirements,
        aiQuestions,
        userAnswers,
        documents,
        isCompleted: isCompleted || false,
      })
      .returning();

    if (isCompleted) {
      await db
        .update(require('../lib/db/schema').users)
        .set({ projectPoints: userRecord.projectPoints - 1 })
        .where(eq(require('../lib/db/schema').users.id, user.id));
    }

    return NextResponse.json(project[0], { status: 201 });
  } catch (error) {
    console.error("创建项目失败:", error);
    return NextResponse.json({ error: "创建项目失败" }, { status: 500 });
  }
}