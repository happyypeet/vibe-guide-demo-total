'use server';

import { db } from './client';
import { 
  users, 
  projects, 
  projectSteps, 
  documents, 
  userPoints, 
  paymentHistories 
} from './schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// 用户相关操作
export async function createUser(email: string, password: string) {
  try {
    const result = await db.insert(users).values({
      email,
      password,
    }).returning();
    
    // 为新用户创建点数记录
    await db.insert(userPoints).values({
      userId: result[0].id,
      totalPoints: 0,
      usedPoints: 0,
    });
    
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create user' };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  } catch (error) {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  } catch (error) {
    return null;
  }
}

// 项目相关操作
export async function createProject(userId: string, name: string, description: string) {
  try {
    const result = await db.insert(projects).values({
      userId,
      name,
      description,
    }).returning();
    
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create project' };
  }
}

export async function getProjectsByUserId(userId: string) {
  try {
    const result = await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
    return result;
  } catch (error) {
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0] || null;
  } catch (error) {
    return null;
  }
}

// 项目步骤相关操作
export async function createProjectStep(projectId: string, stepNumber: number, content: string) {
  try {
    const result = await db.insert(projectSteps).values({
      projectId,
      stepNumber,
      content,
    }).returning();
    
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create project step' };
  }
}

export async function getProjectSteps(projectId: string) {
  try {
    const result = await db.select().from(projectSteps).where(eq(projectSteps.projectId, projectId)).orderBy(projectSteps.stepNumber);
    return result;
  } catch (error) {
    return [];
  }
}

// 文档相关操作
export async function createDocument(projectId: string, type: string, title: string, content: string) {
  try {
    const result = await db.insert(documents).values({
      projectId,
      type,
      title,
      content,
    }).returning();
    
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create document' };
  }
}

export async function getDocumentsByProjectId(projectId: string) {
  try {
    const result = await db.select().from(documents).where(eq(documents.projectId, projectId));
    return result;
  } catch (error) {
    return [];
  }
}

export async function getDocumentByType(projectId: string, type: string) {
  try {
    const result = await db.select().from(documents).where(eq(documents.projectId, projectId).and(eq(documents.type, type)));
    return result[0] || null;
  } catch (error) {
    return null;
  }
}

// 用户点数相关操作
export async function getUserPoints(userId: string) {
  try {
    const result = await db.select().from(userPoints).where(eq(userPoints.userId, userId));
    return result[0] || null;
  } catch (error) {
    return null;
  }
}

export async function updateUserPoints(userId: string, pointsToAdd: number) {
  try {
    const userPoint = await getUserPoints(userId);
    if (!userPoint) {
      return { success: false, error: 'User points not found' };
    }
    
    const result = await db.update(userPoints)
      .set({
        totalPoints: userPoint.totalPoints + pointsToAdd,
        updatedAt: new Date(),
      })
      .where(eq(userPoints.userId, userId))
      .returning();
    
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to update user points' };
  }
}

export async function useUserPoint(userId: string) {
  try {
    const userPoint = await getUserPoints(userId);
    if (!userPoint) {
      return { success: false, error: 'User points not found' };
    }
    
    if (userPoint.totalPoints <= userPoint.usedPoints) {
      return { success: false, error: 'Not enough points' };
    }
    
    const result = await db.update(userPoints)
      .set({
        usedPoints: userPoint.usedPoints + 1,
        updatedAt: new Date(),
      })
      .where(eq(userPoints.userId, userId))
      .returning();
    
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to use user point' };
  }
}

// 支付历史相关操作
export async function createPaymentHistory(userId: string, orderId: string, amount: number, pointsAdded: number) {
  try {
    const result = await db.insert(paymentHistories).values({
      userId,
      orderId,
      amount,
      pointsAdded,
      status: 'pending',
    }).returning();
    
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create payment history' };
  }
}

export async function updatePaymentHistoryStatus(orderId: string, status: string) {
  try {
    const result = await db.update(paymentHistories)
      .set({ status })
      .where(eq(paymentHistories.orderId, orderId))
      .returning();
    
    return { success: true, data: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to update payment history' };
  }
}

export async function getPaymentHistoryByUserId(userId: string) {
  try {
    const result = await db.select().from(paymentHistories).where(eq(paymentHistories.userId, userId)).orderBy(desc(paymentHistories.createdAt));
    return result;
  } catch (error) {
    return [];
  }
}