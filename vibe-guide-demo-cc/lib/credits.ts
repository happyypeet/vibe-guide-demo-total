import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export class CreditsManager {
  /**
   * 检查用户是否有足够的点数
   */
  static async hasEnoughCredits(userId: string, requiredCredits: number = 1): Promise<boolean> {
    const [user] = await db
      .select({ credits: users.credits })
      .from(users)
      .where(eq(users.id, userId));
    
    return user ? user.credits >= requiredCredits : false;
  }

  /**
   * 扣除用户点数
   */
  static async deductCredits(userId: string, amount: number = 1): Promise<boolean> {
    try {
      const [user] = await db
        .select({ credits: users.credits })
        .from(users)
        .where(eq(users.id, userId));

      if (!user || user.credits < amount) {
        return false;
      }

      await db
        .update(users)
        .set({ 
          credits: user.credits - amount,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error('Failed to deduct credits:', error);
      return false;
    }
  }

  /**
   * 增加用户点数
   */
  static async addCredits(userId: string, amount: number): Promise<boolean> {
    try {
      const [user] = await db
        .select({ credits: users.credits })
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        return false;
      }

      await db
        .update(users)
        .set({ 
          credits: user.credits + amount,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error('Failed to add credits:', error);
      return false;
    }
  }

  /**
   * 获取用户当前点数
   */
  static async getUserCredits(userId: string): Promise<number> {
    try {
      const [user] = await db
        .select({ credits: users.credits })
        .from(users)
        .where(eq(users.id, userId));

      return user ? user.credits : 0;
    } catch (error) {
      console.error('Failed to get user credits:', error);
      return 0;
    }
  }

  /**
   * 检查并执行点数相关操作
   */
  static async executeWithCredits<T>(
    userId: string, 
    operation: () => Promise<T>, 
    creditsRequired: number = 1
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      // 检查点数是否足够
      const hasCredits = await this.hasEnoughCredits(userId, creditsRequired);
      if (!hasCredits) {
        return { success: false, error: '点数不足' };
      }

      // 执行操作
      const result = await operation();

      // 扣除点数
      const deducted = await this.deductCredits(userId, creditsRequired);
      if (!deducted) {
        return { success: false, error: '扣除点数失败' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Execute with credits error:', error);
      return { success: false, error: '操作失败' };
    }
  }
}

/**
 * 权限控制中间件
 */
export function withCreditsCheck(requiredCredits: number = 1) {
  return function (target: unknown, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const userId = (this as { userId?: string })?.userId || (args[0] as { userId?: string })?.userId;
      
      if (!userId) {
        throw new Error('User ID is required');
      }

      const hasCredits = await CreditsManager.hasEnoughCredits(userId, requiredCredits);
      if (!hasCredits) {
        throw new Error('Insufficient credits');
      }

      return method.apply(this, args);
    };
  };
}

/**
 * 点数使用记录
 */
export interface CreditUsageRecord {
  userId: string;
  amount: number;
  type: 'project_creation' | 'document_generation' | 'ai_analysis';
  description: string;
  createdAt: Date;
}

export class CreditUsageTracker {
  private static usageRecords: CreditUsageRecord[] = [];

  static recordUsage(record: Omit<CreditUsageRecord, 'createdAt'>) {
    this.usageRecords.push({
      ...record,
      createdAt: new Date()
    });
  }

  static getUserUsage(userId: string, limit: number = 10): CreditUsageRecord[] {
    return this.usageRecords
      .filter(record => record.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  static getTotalUsage(userId: string): number {
    return this.usageRecords
      .filter(record => record.userId === userId)
      .reduce((total, record) => total + record.amount, 0);
  }
}