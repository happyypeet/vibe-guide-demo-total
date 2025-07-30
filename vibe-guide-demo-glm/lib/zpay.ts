import { createHmac } from 'crypto'

export interface ZPayParams {
  pid: string
  money: string
  name: string
  out_trade_no: string
  notify_url: string
  return_url: string
  type: 'alipay' | 'wxpay'
  param?: string
  sign?: string
  sign_type: 'MD5'
}

export function generateZPaySign(params: Omit<ZPayParams, 'sign' | 'sign_type'>, key: string): string {
  // Sort parameters by key name
  const sortedParams = Object.entries(params)
    .filter(([key, value]) => key !== 'sign' && key !== 'sign_type' && value !== undefined && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
  
  // Build query string
  const queryString = sortedParams.map(([key, value]) => `${key}=${value}`).join('&')
  
  // Create MD5 hash with key
  const signString = queryString + key
  return createHmac('md5', signString).digest('hex')
}

export function createZPayUrl(params: Omit<ZPayParams, 'sign' | 'sign_type'>, key: string): string {
  const sign = generateZPaySign(params, key)
  const queryParams = new URLSearchParams({
    ...params,
    sign,
    sign_type: 'MD5'
  })
  
  return `https://z-pay.cn/submit.php?${queryParams.toString()}`
}

export function verifyZPayCallback(params: Record<string, string>, key: string): boolean {
  const { sign, sign_type, ...otherParams } = params
  
  if (sign_type !== 'MD5') {
    return false
  }
  
  const expectedSign = generateZPaySign(otherParams, key)
  return expectedSign === sign
}

export interface ZPayCallbackParams {
  pid: string
  name: string
  money: string
  out_trade_no: string
  trade_no: string
  param?: string
  trade_status: string
  type: string
  sign: string
  sign_type: string
}