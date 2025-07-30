import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, params.id))
      .limit(1);

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("获取项目详情失败:", error);
    return NextResponse.json({ error: "获取项目详情失败" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, detailedRequirements, aiQuestions, userAnswers, documents, isCompleted } = body;

    const [existingProject] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, params.id))
      .limit(1);

    if (!existingProject || existingProject.userId !== user.id) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

    const [updatedProject] = await db
      .update(projects)
      .set({
        title,
        description,
        detailedRequirements,
        aiQuestions,
        userAnswers,
        documents,
        isCompleted,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, params.id))
      .returning();

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("更新项目失败:", error);
    return NextResponse.json({ error: "更新项目失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const [existingProject] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, params.id))
      .limit(1);

    if (!existingProject || existingProject.userId !== user.id) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

    await db.delete(projects).where(eq(projects.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除项目失败:", error);
    return NextResponse.json({ error: "删除项目失败" }, { status: 500 });
  }
}