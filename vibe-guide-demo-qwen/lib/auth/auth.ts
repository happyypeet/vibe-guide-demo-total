'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// 用户登录
export async function signIn(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// 用户注册
export async function signUp(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// 用户登出
export async function signOut() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// 获取当前用户
export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    return null;
  }
  
  return user;
}

// 检查用户是否已认证
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// 需要认证的路由保护
export async function requireAuth() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/auth/login');
  }
  
  return authenticated;
}