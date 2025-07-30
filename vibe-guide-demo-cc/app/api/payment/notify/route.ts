import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { payments, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyNotify } from '@/lib/payment';

export async function GET(request: NextRequest) {
  return handleNotify(request);
}

export async function POST(request: NextRequest) {
  return handleNotify(request);
}

async function handleNotify(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params: Record<string, string> = {};
    
    // 获取查询参数
    for (const [key, value] of url.searchParams) {
      params[key] = value;
    }

    console.log('Payment notify params:', params);

    // 验证签名
    if (!verifyNotify(params)) {
      console.error('Invalid signature');
      return new Response('FAIL', { status: 400 });
    }

    const {
      out_trade_no: outTradeNo,
      trade_no: tradeNo,
      trade_status: tradeStatus,
      money,
    } = params;

    if (tradeStatus !== 'TRADE_SUCCESS') {
      console.log('Trade not successful:', tradeStatus);
      return new Response('success', { status: 200 });
    }

    // 查找支付记录
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.outTradeNo, outTradeNo));

    if (!payment) {
      console.error('Payment not found:', outTradeNo);
      return new Response('FAIL', { status: 400 });
    }

    // 检查支付状态，避免重复处理
    if (payment.status === 'completed') {
      console.log('Payment already processed:', outTradeNo);
      return new Response('success', { status: 200 });
    }

    // 验证金额
    if (parseFloat(money) !== payment.amount) {
      console.error('Amount mismatch:', { expected: payment.amount, received: money });
      return new Response('FAIL', { status: 400 });
    }

    // 开始事务
    await db.transaction(async (tx) => {
      // 更新支付状态
      await tx
        .update(payments)
        .set({
          tradeNo,
          status: 'completed',
          updatedAt: new Date(),
        })
        .where(eq(payments.id, payment.id));

      // 增加用户点数
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, payment.userId));

      if (user) {
        await tx
          .update(users)
          .set({
            credits: user.credits + payment.credits,
            updatedAt: new Date(),
          })
          .where(eq(users.id, payment.userId));
      }
    });

    console.log('Payment processed successfully:', outTradeNo);
    return new Response('success', { status: 200 });
  } catch (error) {
    console.error('Payment notify error:', error);
    return new Response('FAIL', { status: 500 });
  }
}