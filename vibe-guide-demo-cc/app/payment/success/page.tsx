'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get('order');
  const [loading, setLoading] = useState(true);
  const [, setPaymentInfo] = useState<{ orderNo: string; amount: string; credits: string } | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!orderNo) {
        setLoading(false);
        return;
      }

      try {
        // 这里可以调用API检查支付状态，为简化直接显示成功
        setPaymentInfo({
          orderNo,
          amount: '待确认',
          credits: '待确认',
        });
      } catch (error) {
        console.error('Check payment status error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [orderNo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-600 dark:text-green-400">
            支付成功！
          </CardTitle>
          <CardDescription>
            您的支付已完成，点数将在几分钟内到账
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {orderNo && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">支付信息</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">订单号：</span>
                  <span className="font-mono">{orderNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">状态：</span>
                  <span className="text-green-600 dark:text-green-400">支付成功</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              点数正在处理中，请稍等片刻后查看您的账户余额
            </p>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  返回首页
                </Link>
              </Button>
              
              <Button asChild className="flex-1">
                <Link href="/my">
                  查看我的账户
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}