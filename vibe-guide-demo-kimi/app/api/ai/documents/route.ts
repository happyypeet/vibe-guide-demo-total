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
    const { projectDescription, detailedRequirements, userAnswers } = body;

    if (!projectDescription) {
      return NextResponse.json({ error: "项目描述不能为空" }, { status: 400 });
    }

    const documents = await aiService.generateDocuments({
      projectDescription,
      detailedRequirements,
      userAnswers,
    });
    
    return NextResponse.json({ documents });
  } catch (error) {
    console.error("生成文档失败:", error);
    return NextResponse.json({ error: "生成文档失败" }, { status: 500 });
  }
}