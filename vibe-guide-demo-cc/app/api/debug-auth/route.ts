import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Debug Auth Start ===');
    
    // 0. 检查 cookies
    const cookieStore = await cookies();
    const authCookies = cookieStore.getAll().filter(c => 
      c.name.includes('auth') || c.name.includes('supabase')
    );
    console.log('Auth related cookies:', authCookies.map(c => ({
      name: c.name,
      hasValue: !!c.value,
      length: c.value?.length || 0
    })));
    
    // 1. 检查 Supabase 认证
    const supabase = await createClient();
    const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
    
    console.log('Supabase auth error:', authError);
    console.log('Supabase user:', supabaseUser ? { 
      id: supabaseUser.id, 
      email: supabaseUser.email 
    } : 'null');
    
    // 1.5 检查 session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session error:', sessionError);
    console.log('Session:', session ? {
      access_token: session.access_token?.substring(0, 20) + '...',
      expires_at: session.expires_at
    } : 'null');
    
    // 2. 检查我们的 getUser 函数
    const dbUser = await getUser();
    console.log('DB user:', dbUser ? {
      id: dbUser.id,
      email: dbUser.email,
      credits: dbUser.credits
    } : 'null');
    
    return NextResponse.json({
      success: true,
      cookies: authCookies.map(c => ({
        name: c.name,
        hasValue: !!c.value,
        length: c.value?.length || 0
      })),
      supabaseUser: supabaseUser ? {
        id: supabaseUser.id,
        email: supabaseUser.email
      } : null,
      session: session ? {
        hasAccessToken: !!session.access_token,
        expiresAt: session.expires_at
      } : null,
      dbUser: dbUser ? {
        id: dbUser.id,
        email: dbUser.email,
        credits: dbUser.credits
      } : null,
      authError: authError?.message,
      sessionError: sessionError?.message
    });
    
  } catch (error) {
    console.error('Debug auth error:', error);
    
    return NextResponse.json(
      { 
        error: `Debug failed: ${error instanceof Error ? error.message : '未知错误'}`,
        details: error instanceof Error ? error.stack : error
      },
      { status: 500 }
    );
  }
}