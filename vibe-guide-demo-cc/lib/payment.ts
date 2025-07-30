// eslint-disable-next-line @typescript-eslint/no-require-imports
const utility = require('utility');

export interface PaymentParams {
  name: string;
  money: string;
  outTradeNo: string;
  notifyUrl: string;
  returnUrl: string;
  type: 'alipay' | 'wxpay';
}

export function generateOrderId(): string {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return timestamp + random;
}

export function getVerifyParams(params: Record<string, unknown>): string {
  const sPara: [string, unknown][] = [];
  
  for (const key in params) {
    if (!params[key] || key === "sign" || key === "sign_type") {
      continue;
    }
    sPara.push([key, String(params[key])]);
  }
  
  sPara.sort();
  
  let prestr = '';
  for (let i = 0; i < sPara.length; i++) {
    const obj = sPara[i];
    if (i === sPara.length - 1) {
      prestr = prestr + obj[0] + '=' + obj[1];
    } else {
      prestr = prestr + obj[0] + '=' + obj[1] + '&';
    }
  }
  
  return prestr;
}

export function generateSign(params: Record<string, unknown>): string {
  const str = getVerifyParams(params);
  const key = process.env.ZPAY_PKEY!;
  return utility.md5(str + key);
}

export function createPaymentUrl(params: PaymentParams): string {
  const paymentData = {
    pid: process.env.ZPAY_PID!,
    name: params.name,
    money: params.money,
    out_trade_no: params.outTradeNo,
    notify_url: params.notifyUrl,
    return_url: params.returnUrl,
    type: params.type,
    sign_type: 'MD5'
  };

  const sign = generateSign(paymentData);
  const signedData = { ...paymentData, sign };

  const queryParams = new URLSearchParams(signedData).toString();
  return `https://z-pay.cn/submit.php?${queryParams}`;
}

export function verifyNotify(params: Record<string, unknown>): boolean {
  const receivedSign = params.sign;
  delete params.sign;
  delete params.sign_type;
  
  const calculatedSign = generateSign(params);
  return receivedSign === calculatedSign;
}