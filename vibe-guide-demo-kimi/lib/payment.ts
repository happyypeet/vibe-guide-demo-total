import { db } from './db';
import { users, payments } from './db/schema';
import { eq } from 'drizzle-orm';

interface PaymentConfig {
  pid: string;
  pkey: string;
}

interface PaymentRequest {
  amount: number;
  projectPoints: number;
  userId: string;
  email: string;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  paymentId?: string;
  error?: string;
}

export class PaymentService {
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  async createPayment({ amount, projectPoints, userId, email }: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 创建支付记录
      await db.insert(payments).values({
        id: paymentId,
        userId,
        amount,
        projectPoints,
        paymentMethod: 'zpay',
        status: 'pending',
        paymentId: paymentId,
      });

      // 构建Zpay支付URL
      const paymentUrl = `https://zpay.com/pay?pid=${this.config.pid}&amount=${amount}&order_id=${paymentId}&notify_url=${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback&return_url=${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`;

      return {
        success: true,
        paymentUrl,
        paymentId,
      };
    } catch (error) {
      console.error('创建支付失败:', error);
      return {
        success: false,
        error: '创建支付失败',
      };
    }
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      // 这里应该调用Zpay的验证API
      // 为了演示，我们假设验证成功
      const payment = await db
        .select()
        .from(payments)
        .where(eq(payments.paymentId, paymentId));

      if (payment.length === 0) return false;

      // 更新支付状态
      await db
        .update(payments)
        .set({ status: 'completed' })
        .where(eq(payments.paymentId, paymentId));

      // 更新用户点数
      const userPayment = payment[0];
      await db
        .update(users)
        .set({ 
          projectPoints: userPayment.projectPoints,
        })
        .where(eq(users.id, userPayment.userId));

      return true;
    } catch (error) {
      console.error('验证支付失败:', error);
      return false;
    }
  }

  async getUserPaymentHistory(userId: string) {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(payments.createdAt);
  }
}

export const paymentService = new PaymentService({
  pid: process.env.ZPAY_PID!,
  pkey: process.env.ZPAY_PKEY!,
});