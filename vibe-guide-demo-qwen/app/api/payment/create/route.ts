import { NextRequest } from 'next/server';
import { createPaymentOrder } from '@/lib/payments/zpay';
import { createPaymentHistory } from '@/lib/db/actions';

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, userId, plan } = await req.json();
    
    // 创建支付历史记录
    await createPaymentHistory({
      orderId,
      userId,
      amount,
      status: 'pending',
      plan
    });
    
    // 创建ZPay支付订单
    const payUrl = createPaymentOrder({
      orderId,
      amount,
      userId
    });
    
    return Response.json({
      success: true,
      data: {
        payurl: payUrl
      }
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return Response.json({
      success: false,
      error: '支付创建失败'
    }, { status: 500 });
  }
}