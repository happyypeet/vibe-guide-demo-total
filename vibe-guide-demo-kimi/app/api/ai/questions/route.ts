import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { projectDescription } = body;

    if (!projectDescription) {
      return NextResponse.json({ error: "项目描述不能为空" }, { status: 400 });
    }

    const questions = await aiService.generateQuestions(projectDescription);
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("生成问题失败:", error);
    return NextResponse.json({ error: "生成问题失败" }, { status: 500 });
  }
}