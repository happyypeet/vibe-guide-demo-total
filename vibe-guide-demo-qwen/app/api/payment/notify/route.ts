import { NextRequest } from 'next/server';
import { verifyZPayNotification, handlePaymentSuccess } from '@/lib/payments/zpay';
import { updatePaymentHistoryStatus } from '@/lib/db/actions';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    
    // 将FormData转换为普通对象
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString();
    }
    
    // 验证签名
    if (!verifyZPayNotification(params)) {
      return new Response('fail', { status: 400 });
    }
    
    const { out_trade_no: orderId, trade_status: tradeStatus, param: userId, money } = params;
    
    // 检查支付状态
    if (tradeStatus === 'TRADE_SUCCESS') {
      // 根据金额确定点数
      let points = 0;
      const amount = parseFloat(money);
      
      if (amount === 20) {
        points = 10;
      } else if (amount === 40) {
        points = 30;
      }
      
      // 处理支付成功
      const success = await handlePaymentSuccess(orderId, userId, points);
      
      if (success) {
        return new Response('success', { status: 200 });
      } else {
        return new Response('fail', { status: 500 });
      }
    } else {
      // 更新支付状态为失败
      await updatePaymentHistoryStatus(orderId, 'failed');
      return new Response('fail', { status: 400 });
    }
  } catch (error) {
    console.error('Payment notification error:', error);
    return new Response('fail', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // GET请求也处理支付通知（ZPay可能使用GET）
  return POST(req);
}