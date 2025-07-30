import { NextRequest, NextResponse } from 'next/server';
import { generateDocs } from '@/lib/ai';
import { CreditsManager, CreditUsageTracker } from '@/lib/credits';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const user = await requireAuth();
    
    const { description, requirements } = await request.json();
    
    if (!description || !requirements) {
      return NextResponse.json(
        { error: '项目描述和需求分析不能为空' },
        { status: 400 }
      );
    }

    // 检查点数
    const hasCredits = await CreditsManager.hasEnoughCredits(user.id, 1);
    if (!hasCredits) {
      return NextResponse.json(
        { error: '点数不足，请先充值' },
        { status: 403 }
      );
    }

    // 使用点数管理器执行操作
    const result = await CreditsManager.executeWithCredits(
      user.id,
      () => generateDocs(description, requirements),
      1
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === '点数不足' ? 403 : 500 }
      );
    }

    // 记录点数使用
    CreditUsageTracker.recordUsage({
      userId: user.id,
      amount: 1,
      type: 'document_generation',
      description: '生成项目文档'
    });
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Generate docs error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: '认证失败' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: '生成文档失败，请重试' },
      { status: 500 }
    );
  }
}