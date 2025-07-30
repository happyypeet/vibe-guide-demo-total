import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { users, userCredits } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { User } from '@/lib/db/schema'

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('No authenticated user found')
      return null
    }

    console.log('Authenticated user:', user.id, user.email)

    let dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id)
    })

    if (!dbUser) {
      console.log('Creating new user in database:', user.id)
      try {
        const [newUser] = await db.insert(users).values({
          id: user.id,
          email: user.email!,
          name: user.user_metadata.full_name || user.email,
        }).returning()

        await db.insert(userCredits).values({
          userId: newUser.id,
          credits: 0,
        })

        dbUser = newUser
        console.log('User created successfully:', dbUser.id)
      } catch (insertError) {
        console.error('Error creating user:', insertError)
        return null
      }
    }

    return dbUser
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export async function getUserCredits(userId: string): Promise<number> {
  const userCredit = await db.query.userCredits.findFirst({
    where: eq(userCredits.userId, userId)
  })
  
  return userCredit?.credits || 0
}

export async function updateUserCredits(userId: string, credits: number): Promise<void> {
  await db
    .update(userCredits)
    .set({ credits, updatedAt: new Date() })
    .where(eq(userCredits.userId, userId))
}