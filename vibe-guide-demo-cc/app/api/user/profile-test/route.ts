import { NextResponse } from 'next/server';

// 临时测试端点，返回模拟用户数据
export async function GET() {
  return NextResponse.json({
    id: 'test-user-id',
    email: 'test@example.com',
    credits: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}