import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    
    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.error('Get credits error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: '获取点数信息失败' },
      { status: 500 }
    );
  }
}