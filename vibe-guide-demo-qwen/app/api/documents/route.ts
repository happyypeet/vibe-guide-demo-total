import { NextRequest } from 'next/server';
import { generateDocumentContent } from '@/lib/ai/claude';
import { createProject, createProjectStep, createDocument } from '@/lib/db/actions';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // 检查用户认证
    if (error || !user) {
      return new Response(
        JSON.stringify({ success: false, error: '用户未认证' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { projectDescription, answers, projectName, projectDescriptionText } = await req.json();
    
    // 创建项目
    const projectResult = await createProject(user.id, projectName, projectDescriptionText);
    if (!projectResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: '创建项目失败' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const project = projectResult.data;
    
    // 保存项目步骤1（项目描述）
    await createProjectStep(project.id, 1, projectDescriptionText);
    
    // 保存项目步骤2（用户回答）
    await createProjectStep(project.id, 2, JSON.stringify(answers));
    
    // 文档类型列表
    const documentTypes = [
      { type: 'user-journey', title: '用户旅程地图' },
      { type: 'prd', title: '产品需求PRD' },
      { type: 'frontend', title: '前端设计文档' },
      { type: 'backend', title: '后端设计文档' },
      { type: 'database', title: '数据库设计' },
    ];
    
    // 生成所有文档
    const generatedDocuments = [];
    for (const docType of documentTypes) {
      const content = await generateDocumentContent(
        projectDescriptionText,
        Object.values(answers),
        docType.type
      );
      
      const docResult = await createDocument(
        project.id,
        docType.type,
        docType.title,
        content
      );
      
      if (docResult.success) {
        generatedDocuments.push(docResult.data);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { 
          projectId: project.id,
          documents: generatedDocuments
        } 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Document generation error:', error);
    return new Response(
      JSON.stringify({ success: false, error: '文档生成过程中出现错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}