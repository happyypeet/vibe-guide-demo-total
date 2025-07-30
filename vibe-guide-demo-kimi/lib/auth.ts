import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export const createClient = () => createClientComponentClient();

export const createServer = () => createServerComponentClient({ cookies });

export const getUser = async () => {
  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const supabase = createServer();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const requireAuth = async () => {
  const user = await getUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
};

export const getUserWithPoints = async () => {
  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const [userRecord] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id));
    
  return userRecord;
};

export const createUserRecord = async (userId: string, email: string) => {
  await db.insert(users).values({
    id: userId,
    email,
    projectPoints: 0,
  });
};