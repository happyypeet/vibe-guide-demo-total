import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // 同步用户到我们的数据库
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email!));

    if (!dbUser) {
      // 创建新用户
      try {
        const [newUser] = await db
          .insert(users)
          .values({
            email: user.email!,
            credits: 0,
          })
          .returning();
        console.log('Created new user:', newUser.email);
        return newUser;
      } catch (insertError) {
        console.error('Failed to create user:', insertError);
        // 可能是并发创建导致的重复，重新查询
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email!));
        if (existingUser) return existingUser;
        throw insertError;
      }
    }

    return dbUser;
  } catch (error) {
    console.error('getUser error:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}