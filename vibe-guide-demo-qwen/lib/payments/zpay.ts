'use server';

import crypto from 'crypto';
import { createPaymentHistory, updatePaymentHistoryStatus, updateUserPoints } from '@/lib/db/actions';

// ZPay配置
const ZPAY_PID = process.env.ZPAY_PID;
const ZPAY_PKEY = process.env.ZPAY_PKEY;
const ZPAY_API_URL = 'https://z-pay.cn/submit.php';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

// 生成ZPay签名
function generateSignature(params: Record<string, string>, key: string): string {
  // 1. 过滤空值和特定字段
  const filteredParams: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v && k !== 'sign' && k !== 'sign_type') {
      filteredParams[k] = v;
    }
  }

  // 2. 按键名ASCII码排序
  const sortedKeys = Object.keys(filteredParams).sort();
  
  // 3. 拼接字符串
  const paramString = sortedKeys
    .map(key => `${key}=${filteredParams[key]}`)
    .join('&');
  
  // 4. 拼接密钥并生成MD5签名
  const signString = paramString + key;
  return crypto.createHash('md5').update(signString).digest('hex');
}

// 创建支付订单
export function createPaymentOrder(
  params: {
    orderId: string;
    amount: number;
    userId: string;
  }
) {
  // 检查必要配置
  if (!ZPAY_PID || !ZPAY_PKEY || !SITE_URL) {
    throw new Error('Payment configuration missing');
  }

  const { orderId, amount, userId } = params;
  
  // 根据金额确定产品名称
  let productName = '';
  if (amount === 20) {
    productName = '基础套餐 - 10个项目点数';
  } else if (amount === 40) {
    productName = '专业套餐 - 30个项目点数';
  } else {
    productName = `自定义套餐 - ${amount}元`;
  }

  // 构造支付参数
  const paymentParams = {
    pid: ZPAY_PID,
    type: 'alipay', // 默认使用支付宝
    out_trade_no: orderId,
    notify_url: `${SITE_URL}/api/payment/notify`,
    return_url: `${SITE_URL}/payment/success`,
    name: productName,
    money: amount.toString(),
    param: userId,
    sign_type: 'MD5',
  };

  // 生成签名
  const sign = generateSignature(paymentParams, ZPAY_PKEY);
  
  // 构造完整的支付URL
  const paymentUrl = `${ZPAY_API_URL}?${new URLSearchParams({ ...paymentParams, sign }).toString()}`;

  return paymentUrl;
}

// 验证支付通知签名
export function verifyZPayNotification(params: Record<string, string>): boolean {
  if (!ZPAY_PKEY) return false;

  const { sign, sign_type, ...otherParams } = params;
  
  if (!sign || sign_type !== 'MD5') {
    return false;
  }

  const generatedSign = generateSignature(otherParams, ZPAY_PKEY);
  return generatedSign === sign;
}

// 处理支付成功
export async function handlePaymentSuccess(orderId: string, userId: string, points: number) {
  try {
    // 更新支付状态
    await updatePaymentHistoryStatus(orderId, 'success');
    
    // 更新用户点数
    const result = await updateUserPoints(userId, points);
    
    return result.success;
  } catch (error) {
    console.error('Error handling payment success:', error);
    return false;
  }
}