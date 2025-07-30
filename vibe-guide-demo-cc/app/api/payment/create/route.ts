import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { payments } from '@/lib/db/schema';
import { createPaymentUrl, generateOrderId } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { amount, credits, planName } = await request.json();
    
    if (!amount || !credits || !planName) {
      return NextResponse.json(
        { error: '参数不完整' },
        { status: 400 }
      );
    }

    // 生成订单号
    const outTradeNo = generateOrderId();
    
    // 创建支付记录
    await db.insert(payments).values({
      userId: user.id,
      amount,
      credits,
      outTradeNo,
      status: 'pending',
      paymentMethod: 'alipay',
    });

    // 生成支付URL
    const paymentUrl = createPaymentUrl({
      name: `${planName} - ${credits}个项目点数`,
      money: amount.toString(),
      outTradeNo,
      notifyUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/notify`,
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?order=${outTradeNo}`,
      type: 'alipay',
    });

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: '创建支付订单失败' },
      { status: 500 }
    );
  }
}